import Anthropic from "@anthropic-ai/sdk"
import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createContactSubmission } from "@/lib/data/contact"
import { getDemiSystemPrompt } from "@/lib/demi/context"
import { allow, clientKey } from "@/lib/demi/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = process.env.DEMI_MODEL || "claude-opus-5-5"

// Conversation limits. These bound what one visitor can spend per request and
// per conversation; the rate limiter bounds how often they can ask.
const MAX_TURNS = 24
const MAX_USER_CHARS = 1500
const MAX_ASSISTANT_CHARS = 8000
const CHAT_LIMIT = { count: 20, windowMs: 10 * 60 * 1000 }
const SEND_LIMIT = { count: 3, windowMs: 60 * 60 * 1000 }

const bodySchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(MAX_USER_CHARS) }),
        z.object({
          role: z.literal("assistant"),
          content: z.string().trim().min(1).max(MAX_ASSISTANT_CHARS),
        }),
      ])
    )
    .min(1)
    .max(MAX_TURNS)
    .refine((m) => m[0].role === "user" && m[m.length - 1].role === "user", {
      message: "Conversation must start and end with a user message",
    }),
})

const sendInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
})

function text(message: string, status: number) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } })
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return text("Demi isn't configured yet.", 503)
  }

  const ip = clientKey(request)
  if (!allow(`chat:${ip}`, CHAT_LIMIT.count, CHAT_LIMIT.windowMs)) {
    return text("You're sending messages quickly. Give it a few minutes and try again.", 429)
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return text("That message couldn't be read. Try a shorter one.", 400)
  }

  let system: string
  try {
    system = await getDemiSystemPrompt()
  } catch (error) {
    console.error("[demi] failed to load site content", error)
    return text("Demi can't reach the site content right now. Please try again shortly.", 503)
  }

  const client = new Anthropic()

  // The model's tool input is validated here rather than by the SDK: its Zod
  // helper targets Zod 4 and this project is on Zod 3.
  const sendMessage = betaTool({
    name: "send_message_to_nasiru",
    description:
      "Deliver a message from the visitor to Nasiru's inbox. Call this only after the visitor has given their name and email, has seen the message text, and has explicitly confirmed they want it sent.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The visitor's name" },
        email: { type: "string", description: "The visitor's email address" },
        message: {
          type: "string",
          description: "The message to deliver, in the visitor's own words",
        },
      },
      required: ["name", "email", "message"],
      additionalProperties: false,
    },
    run: async (input) => {
      const result = sendInputSchema.safeParse(input)
      if (!result.success) {
        return "Not sent: the name, email address, or message is missing or invalid. Ask the visitor to correct it."
      }
      const { name, email, message } = result.data

      if (!allow(`send:${ip}`, SEND_LIMIT.count, SEND_LIMIT.windowMs)) {
        return "Not sent: this visitor has reached the limit for messages sent through Demi. Point them to the contact form at /#contact instead."
      }
      try {
        await createContactSubmission({ name, email, message: `[via Demi] ${message}` })
        revalidatePath("/admin/messages")
        revalidatePath("/admin")
        return "Sent. The message is in Nasiru's inbox."
      } catch (error) {
        console.error("[demi] failed to store message", error)
        return "Not sent: saving the message failed. Point the visitor to the contact form at /#contact instead."
      }
    },
  })

  const runner = client.beta.messages.toolRunner({
    model: MODEL,
    // Deliberately small: Demi's answers are a few sentences, and this caps
    // what a single public request can cost.
    max_tokens: 2000,
    output_config: { effort: "low" },
    // If the model declines a request, let the API retry it on a fallback
    // model rather than returning an empty turn.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    tools: [sendMessage],
    messages: parsed.data.messages,
    max_iterations: 4,
    stream: true,
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false
      const write = (chunk: string) => {
        if (!chunk) return
        wroteText = true
        controller.enqueue(encoder.encode(chunk))
      }

      try {
        for await (const messageStream of runner) {
          for await (const event of messageStream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              write(event.delta.text)
            }
          }

          const message = await messageStream.finalMessage()
          if (message.stop_reason === "refusal") {
            if (!wroteText) write("Sorry, I can't help with that one.")
            break
          }
          // A turn cut off mid tool call would hand the tool a truncated
          // input, so stop before the runner executes it.
          if (
            message.stop_reason === "max_tokens" &&
            message.content.some((block) => block.type === "tool_use")
          ) {
            write("\n\nSorry, I lost my place there. Could you say that again?")
            break
          }
        }
        if (!wroteText) write("Sorry, I didn't catch that. Could you rephrase?")
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          console.error("[demi] rate limited by the API")
          write(wroteText ? "\n\n" : "")
          write("I'm getting a lot of questions right now. Please try again in a minute.")
        } else if (error instanceof Anthropic.APIError) {
          console.error(`[demi] API error ${error.status}`, error.message)
          write(wroteText ? "\n\n" : "")
          write("Something went wrong on my side. Please try again.")
        } else {
          console.error("[demi] unexpected error", error)
          write(wroteText ? "\n\n" : "")
          write("Something went wrong on my side. Please try again.")
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
