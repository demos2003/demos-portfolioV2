"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { ArrowRight, ArrowUp, Home, RotateCcw, X } from "lucide-react"
import emailjs from "@emailjs/browser"
import { DemiSprite, type DemiMood } from "@/components/demi/demi-sprite"
import { DemiHome } from "@/components/demi/demi-home"
import { DEMI_EVENT_MARK, EMAILJS } from "@/lib/emailjs"

type ChatMessage = { role: "user" | "assistant"; content: string }
type Wakefulness = "awake" | "sleepy" | "sleeping"

// Mirrors the server's limits in app/api/demi/route.ts.
const MAX_TURNS = 24
const MAX_CHARS = 1500

const SIZE = 76
// Demi dozes off after this long without any input from the visitor. At night
// the fuse is shorter: once woken, Demi heads back to bed quickly.
const IDLE_MS = 60_000
const NIGHT_IDLE_MS = 25_000
// Ignored for this long (no tap, petting or chat), Demi stops following and
// trudges sadly back to its corner, staying there until someone taps it.
const IGNORED_MS = 15_000
const SULK_LINES = ["Oh... okay. I'll be in my corner.", "I'll just wait over here, then.", "Nobody wants to play?"]
// A tab left in the background for this long comes back to a sleeping Demi.
const AWAY_MS = 60_000
// A visitor who hasn't been here for this long finds Demi asleep on arrival.
const LONG_ABSENCE_MS = 3 * 24 * 60 * 60 * 1000
const LAST_SEEN_KEY = "demi:last-seen"

const SUGGESTIONS = [
  "What has Nasiru built?",
  "Does he build AI agents?",
  "How does he run a project?",
  "I'd like to hire him",
]

// One-off remarks as the visitor scrolls through the home page.
const SECTION_LINES: Record<string, string> = {
  about: "That's Nasiru. I think he's pretty great.",
  services: "The AI agents one? That's how I got here.",
  process: "Step one is listening. I'm good at that too.",
  skills: "So many tools. I mostly know how to nap.",
  projects: "Ooh, the good stuff. Tap me for the story behind one.",
  blog: "He writes too. I just nod along.",
  contact: "Want me to pass him a message? Tap me!",
}

function isNight(date = new Date()) {
  const hour = date.getHours()
  return hour >= 22 || hour < 6
}

function viewport() {
  return { w: document.documentElement.clientWidth, h: window.innerHeight }
}

function homePosition() {
  const { w, h } = viewport()
  const margin = w < 640 ? 16 : 24
  return { x: w - SIZE - margin, y: h - SIZE - margin }
}

function clampToViewport(x: number, y: number) {
  const { w, h } = viewport()
  return {
    x: Math.min(Math.max(x, 12), w - SIZE - 12),
    // Leave headroom so the speech bubble above Demi stays on screen.
    y: Math.min(Math.max(y, 96), h - SIZE - 12),
  }
}

// Demi answers in plain text with markdown links only. Render those links
// (internal ones client-side) and drop stray bold markers.
function renderContent(content: string) {
  const parts: React.ReactNode[] = []
  const pattern = /\[([^\]]+)\]\(((?:\/|https?:\/\/)[^\s)]*)\)/g
  const clean = content.replace(/\*\*/g, "")
  const className = "text-signal underline underline-offset-2 hover:text-signal-hover"
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(clean))) {
    if (match.index > last) parts.push(clean.slice(last, match.index))
    const [, label, href] = match
    parts.push(
      href.startsWith("/") ? (
        <Link key={match.index} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>
      )
    )
    last = match.index + match[0].length
  }
  if (last < clean.length) parts.push(clean.slice(last))
  return parts
}

// When Demi stores a visitor's message, also email it to Nasiru using the same
// EmailJS template as the contact form. The message is already saved in the
// admin inbox by this point, so a failed email loses nothing.
function handleEvent(json: string) {
  try {
    const event = JSON.parse(json)
    if (event.type !== "message_sent") return
    emailjs
      .send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        { user_name: event.name, user_email: event.email, message: `[via Demi] ${event.message}` },
        EMAILJS.publicKey
      )
      .catch((error) => console.error("[demi] email notification failed", error))
  } catch {
    // Malformed event: ignore it and keep showing the reply.
  }
}

// Tracks the area actually visible on phones (shrinks when the keyboard opens),
// so the chat panel can sit inside it instead of behind the keyboard.
function useVisibleArea() {
  const [area, setArea] = useState({ mobile: false, height: 0, inset: 0 })
  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport
      const height = vv?.height ?? window.innerHeight
      const inset = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0
      setArea({ mobile: document.documentElement.clientWidth < 640, height, inset })
    }
    update()
    window.addEventListener("resize", update)
    window.visualViewport?.addEventListener("resize", update)
    window.visualViewport?.addEventListener("scroll", update)
    return () => {
      window.removeEventListener("resize", update)
      window.visualViewport?.removeEventListener("resize", update)
      window.visualViewport?.removeEventListener("scroll", update)
    }
  }, [])
  return area
}

function useDemiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const atLimit = messages.length >= MAX_TURNS - 1
  const last = messages[messages.length - 1]
  const streaming = busy && last?.role === "assistant" && last.content.length > 0

  const setReply = (content: string) =>
    setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content }])

  async function send(raw: string) {
    const content = raw.trim().slice(0, MAX_CHARS)
    if (!content || busy || atLimit) return

    const history: ChatMessage[] = [...messages, { role: "user", content }]
    setMessages([...history, { role: "assistant", content: "" }])
    setBusy(true)
    setFailed(false)

    const controller = new AbortController()
    abortRef.current = controller
    let reply = ""
    let received = ""
    let eventsHandled = 0

    try {
      const response = await fetch("/api/demi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        setFailed(true)
        setReply((await response.text().catch(() => "")) || "Something went wrong. Please try again.")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        received += decoder.decode(value, { stream: true })

        // The stream is Demi's text with occasional events wrapped in marker
        // characters. Odd-numbered segments are events; a trailing one may
        // still be arriving, so only complete ones are acted on.
        const segments = received.split(DEMI_EVENT_MARK)
        const complete = Math.floor((segments.length - 1) / 2)
        for (; eventsHandled < complete; eventsHandled++) {
          handleEvent(segments[eventsHandled * 2 + 1])
        }
        reply = segments.filter((_, i) => i % 2 === 0).join("")
        setReply(reply)
      }
      if (!reply.trim()) setReply("Sorry, I didn't catch that. Could you rephrase?")
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setFailed(true)
        setReply(
          reply ? `${reply}\n\nThe connection dropped. Please try again.` : "I couldn't connect. Please try again."
        )
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  function reset() {
    abortRef.current?.abort()
    setMessages([])
    setBusy(false)
    setFailed(false)
  }

  return { messages, busy, failed, streaming, atLimit, send, reset }
}

export function Demi() {
  const reduceMotion = useReducedMotion()
  const chat = useDemiChat()
  const area = useVisibleArea()

  const [mounted, setMounted] = useState(false)
  const [wakefulness, setWakefulness] = useState<Wakefulness>("awake")
  const [night, setNight] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sulking, setSulking] = useState(false)
  const [homeOpen, setHomeOpen] = useState(false)
  const [flash, setFlash] = useState<DemiMood | null>(null)
  const [near, setNear] = useState(false)
  const [moving, setMoving] = useState(false)
  const [bubbleOnLeft, setBubbleOnLeft] = useState(false)
  const [line, setLine] = useState<string | null>(null)
  const [input, setInput] = useState("")

  // Where Demi wants to be; the springs make it amble there.
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const x = useSpring(targetX, { stiffness: 34, damping: 15, mass: 1 })
  const y = useSpring(targetY, { stiffness: 34, damping: 15, mass: 1 })
  const lean = useMotionValue(0)
  const eyeX = useMotionValue(0)
  const eyeY = useMotionValue(0)

  const cursor = useRef({ x: 0, y: 0, movedAt: 0, known: false, touch: false, holding: false })
  const lastActivity = useRef(0)
  // Last time the visitor did something *to Demi*, as opposed to the page.
  const lastInteraction = useRef(0)
  const nextWanderAt = useRef(0)
  const petting = useRef({ distance: 0, at: 0 })
  const spokenSections = useRef(new Set<string>())
  const missedYou = useRef(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lineTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Latest values for the long-lived listeners and timers below.
  const live = useRef({ wakefulness, chatOpen, homeOpen, sulking, night, busy: chat.busy, reduceMotion })
  live.current = { wakefulness, chatOpen, homeOpen, sulking, night, busy: chat.busy, reduceMotion }

  const goTo = useCallback(
    (px: number, py: number) => {
      const p = clampToViewport(px, py)
      targetX.set(p.x)
      targetY.set(p.y)
    },
    [targetX, targetY]
  )
  const goHome = useCallback(() => {
    const home = homePosition()
    targetX.set(home.x)
    targetY.set(home.y)
  }, [targetX, targetY])

  const say = useCallback((text: string, ms = 2600 + text.length * 45) => {
    clearTimeout(lineTimer.current)
    setLine(text)
    lineTimer.current = setTimeout(() => setLine(null), ms)
  }, [])

  const flashMood = useCallback((mood: DemiMood, ms = 1600) => {
    clearTimeout(flashTimer.current)
    setFlash(mood)
    flashTimer.current = setTimeout(() => setFlash(null), ms)
  }, [])

  const fallAsleep = useCallback(() => {
    clearTimeout(sleepTimer.current)
    setChatOpen(false)
    setLine(null)
    goHome()
    setWakefulness("sleepy")
    sleepTimer.current = setTimeout(() => setWakefulness("sleeping"), 2600)
  }, [goHome])

  const wake = useCallback(() => {
    clearTimeout(sleepTimer.current)
    lastActivity.current = Date.now()
    lastInteraction.current = Date.now()
    setSulking(false)
    setWakefulness("awake")
    flashMood("excited", 1800)
    if (missedYou.current) {
      missedYou.current = false
      say("You're back! I missed you.")
    } else if (live.current.night) {
      say("Mmf... it's late. What do you need?")
    } else {
      say("Oh! Hi. I was just resting my eyes.")
    }
  }, [flashMood, say])

  // Set up: starting position, whether to start asleep, and the greeting.
  useEffect(() => {
    const home = homePosition()
    targetX.jump(home.x)
    targetY.jump(home.y)
    x.jump(home.x)
    y.jump(home.y)
    lastActivity.current = Date.now()
    lastInteraction.current = Date.now()

    const nightNow = isNight()
    setNight(nightNow)

    let longAbsence = false
    try {
      const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY))
      longAbsence = lastSeen > 0 && Date.now() - lastSeen > LONG_ABSENCE_MS
      localStorage.setItem(LAST_SEEN_KEY, String(Date.now()))
    } catch {
      // Storage unavailable (private mode): Demi just won't remember visits.
    }

    let greeting: ReturnType<typeof setTimeout> | undefined
    if (nightNow || longAbsence) {
      missedYou.current = longAbsence && !nightNow
      setWakefulness("sleeping")
    } else {
      greeting = setTimeout(() => say("Hi! I'm Demi. Tap me to chat."), 1400)
    }
    setMounted(true)

    return () => {
      clearTimeout(greeting)
      clearTimeout(flashTimer.current)
      clearTimeout(lineTimer.current)
      clearTimeout(sleepTimer.current)
    }
  }, [say, targetX, targetY, x, y])

  // Track the visitor: cursor, activity, tab visibility, viewport size.
  useEffect(() => {
    const active = () => {
      lastActivity.current = Date.now()
    }
    const onPointerMove = (e: PointerEvent) => {
      active()
      if (e.pointerType === "mouse") {
        cursor.current = { x: e.clientX, y: e.clientY, movedAt: Date.now(), known: true, touch: false, holding: false }
      }
    }

    // Phones: press and hold anywhere and Demi follows the finger.
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let start = { x: 0, y: 0 }
    let holdId = -1
    const follow = (x: number, y: number) => {
      cursor.current = { x, y, movedAt: Date.now(), known: true, touch: true, holding: true }
    }
    const endHold = () => {
      clearTimeout(holdTimer)
      holdId = -1
      if (cursor.current.holding) {
        cursor.current.holding = false
        document.body.style.removeProperty("user-select")
        document.body.style.removeProperty("-webkit-user-select")
      }
    }
    const onTouchDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return
      const { wakefulness, chatOpen, homeOpen } = live.current
      if (wakefulness !== "awake" || chatOpen || homeOpen) return
      if ((e.target as Element | null)?.closest?.("a, button, input, textarea, select, [role=dialog]")) return
      start = { x: e.clientX, y: e.clientY }
      holdId = e.pointerId
      clearTimeout(holdTimer)
      holdTimer = setTimeout(() => {
        follow(start.x, start.y)
        lastInteraction.current = Date.now()
        setSulking(false)
        document.body.style.setProperty("user-select", "none")
        document.body.style.setProperty("-webkit-user-select", "none")
      }, 350)
    }
    const onTouchMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || e.pointerId !== holdId) return
      if (cursor.current.holding) {
        follow(e.clientX, e.clientY)
      } else if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) {
        clearTimeout(holdTimer) // it's a scroll or swipe, not a hold
      }
    }
    // Once holding, keep the page from scrolling under the finger.
    const blockScroll = (e: TouchEvent) => {
      if (cursor.current.holding && e.cancelable) e.preventDefault()
    }
    const blockMenu = (e: Event) => {
      if (cursor.current.holding) e.preventDefault()
    }
    const onScroll = () => {
      active()
      const { wakefulness, chatOpen } = live.current
      if (wakefulness !== "awake" || chatOpen) return
      let current: string | null = null
      for (const id of Object.keys(SECTION_LINES)) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = id
      }
      if (current && !spokenSections.current.has(current)) {
        spokenSections.current.add(current)
        say(SECTION_LINES[current])
      }
    }

    let hiddenAt = 0
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now()
        try {
          localStorage.setItem(LAST_SEEN_KEY, String(Date.now()))
        } catch {}
      } else if (hiddenAt && Date.now() - hiddenAt > AWAY_MS && !live.current.busy) {
        clearTimeout(sleepTimer.current)
        setChatOpen(false)
        goHome()
        setWakefulness("sleeping")
      }
    }
    const onResize = () => {
      if (live.current.wakefulness !== "awake" || live.current.chatOpen) goHome()
      else goTo(targetX.get(), targetY.get())
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerdown", active, { passive: true })
    window.addEventListener("pointerdown", onTouchDown, { passive: true })
    window.addEventListener("pointermove", onTouchMove, { passive: true })
    window.addEventListener("pointerup", endHold)
    window.addEventListener("pointercancel", endHold)
    window.addEventListener("touchmove", blockScroll, { passive: false })
    window.addEventListener("contextmenu", blockMenu)
    window.addEventListener("keydown", active)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", active)
      window.removeEventListener("pointerdown", onTouchDown)
      window.removeEventListener("pointermove", onTouchMove)
      window.removeEventListener("pointerup", endHold)
      window.removeEventListener("pointercancel", endHold)
      window.removeEventListener("touchmove", blockScroll)
      window.removeEventListener("contextmenu", blockMenu)
      endHold()
      window.removeEventListener("keydown", active)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [goHome, goTo, say, targetX, targetY])

  // Decide where to go: trail the cursor, wander when it's still, sleep when
  // nobody's around, and go to bed when night falls.
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now()
      const state = live.current

      const nightNow = isNight()
      if (nightNow !== state.night) setNight(nightNow)

      if (state.wakefulness !== "awake") return

      if (state.homeOpen) {
        // Demi is at home with the visitor: nothing to follow, nobody ignoring it.
        lastActivity.current = now
        lastInteraction.current = now
        return
      }

      if (state.chatOpen || state.busy) {
        // Chatting counts as attention for as long as it lasts.
        lastInteraction.current = now
        goHome()
        return
      }

      const idleLimit = nightNow ? NIGHT_IDLE_MS : IDLE_MS
      if (now - lastActivity.current > idleLimit) {
        fallAsleep()
        return
      }

      if (state.reduceMotion) return

      if (state.sulking) {
        goHome()
        return
      }
      if (now - lastInteraction.current > IGNORED_MS) {
        setSulking(true)
        goHome()
        flashMood("sad", 7000)
        say(SULK_LINES[Math.floor(Math.random() * SULK_LINES.length)])
        return
      }

      const c = cursor.current
      if (c.holding) {
        // Finger down: stay lively and keep Demi hovering just above it.
        lastActivity.current = now
        lastInteraction.current = now
        c.movedAt = now
      }
      if (c.known && now - c.movedAt < 5000) {
        // Sit just below-right of the cursor, and only shift once the cursor
        // has moved a fair way, so Demi trails rather than jitters.
        // A finger covers what's under it, so on touch Demi hovers above it.
        const want = c.touch
          ? clampToViewport(c.x - SIZE / 2, c.y - SIZE - 28)
          : clampToViewport(c.x + 44, c.y + 40)
        if (Math.hypot(want.x - targetX.get(), want.y - targetY.get()) > (c.touch ? 16 : 70)) goTo(want.x, want.y)
        nextWanderAt.current = now + 3500
      } else if (now > nextWanderAt.current) {
        // Stroll along the bottom of the window, out of the way of content.
        const { w } = viewport()
        goTo(16 + Math.random() * (w - SIZE - 32), homePosition().y)
        nextWanderAt.current = now + 4500 + Math.random() * 5500
      }
    }, 300)
    return () => clearInterval(tick)
  }, [fallAsleep, flashMood, goHome, goTo, say, targetX, targetY])

  // Per-frame: lean into movement, look at the cursor, notice it getting close.
  useAnimationFrame(() => {
    if (!mounted) return
    const vx = x.getVelocity()
    const speed = Math.hypot(vx, y.getVelocity())
    const isMoving = speed > 45
    if (isMoving !== moving) setMoving(isMoving)
    lean.set(Math.max(-9, Math.min(9, vx / 45)))

    const px = x.get() + SIZE / 2
    const py = y.get() + SIZE / 2
    const onLeft = px < viewport().w / 2
    if (onLeft !== bubbleOnLeft) setBubbleOnLeft(onLeft)

    const c = cursor.current
    if (!c.known || wakefulness !== "awake") {
      eyeX.set(0)
      eyeY.set(0)
      if (near) setNear(false)
      return
    }
    const dx = c.x - px
    const dy = c.y - py
    const distance = Math.hypot(dx, dy) || 1
    const reach = Math.min(1, distance / 120)
    eyeX.set((dx / distance) * 3.6 * reach)
    eyeY.set((dy / distance) * 3 * reach)
    const isNear = distance < 130
    if (isNear !== near) setNear(isNear)
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [chat.messages, chatOpen])

  useEffect(() => {
    if (!chatOpen) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [chatOpen])

  function onTap() {
    if (wakefulness !== "awake") {
      wake()
      return
    }
    lastInteraction.current = Date.now()
    setSulking(false)
    setLine(null)
    setChatOpen((open) => !open)
    flashMood("excited", 900)
  }

  // Rubbing the cursor back and forth over Demi counts as petting.
  function onPet(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || wakefulness !== "awake") return
    const now = Date.now()
    const p = petting.current
    if (now - p.at > 700) p.distance = 0
    p.distance += Math.abs(e.movementX) + Math.abs(e.movementY)
    p.at = now
    if (p.distance > 320) {
      p.distance = 0
      lastInteraction.current = now
      setSulking(false)
      flashMood("love", 2600)
    }
  }

  const closeHome = useCallback(() => {
    setHomeOpen(false)
    lastInteraction.current = Date.now()
    goHome()
    say("Thanks for visiting!")
  }, [goHome, say])

  function openHome() {
    setChatOpen(false)
    setLine(null)
    setSulking(false)
    setHomeOpen(true)
  }

  function submit(text: string) {
    chat.send(text)
    setInput("")
  }

  if (!mounted) return null

  let mood: DemiMood = "happy"
  if (wakefulness === "sleeping") mood = "sleeping"
  else if (wakefulness === "sleepy") mood = "sleepy"
  else if (chat.busy) mood = chat.streaming ? "talking" : "thinking"
  else if (flash) mood = flash
  else if (chat.failed && chatOpen) mood = "sad"
  else if (near && !chatOpen) mood = "curious"

  const label =
    wakefulness === "awake"
      ? chatOpen
        ? "Close chat with Demi"
        : "Chat with Demi"
      : "Demi is asleep. Tap to wake"

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            role="dialog"
            aria-label="Chat with Demi"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={
              area.mobile
                ? // Phone: a sheet above the keyboard; Demi steps aside while it's open.
                  { bottom: area.inset + 12, maxHeight: Math.min(480, area.height - 24), transformOrigin: "bottom" }
                : { bottom: SIZE + 44, transformOrigin: "bottom right" }
            }
            className="fixed z-50 right-3 left-3 sm:left-auto sm:right-6 sm:w-[22rem] sm:max-h-[min(30rem,calc(100dvh-10rem))] flex flex-col rounded-2xl bg-[#1A1716] border border-paper/15 shadow-2xl shadow-black/60 text-paper"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-paper/10">
              <span className="font-serif text-base text-paper">Demi</span>
              <span className="text-xs text-paper/40">Nasiru&apos;s portfolio pet</span>
              <div className="ml-auto flex items-center gap-1">
                {chat.messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      chat.reset()
                      setInput("")
                      inputRef.current?.focus()
                    }}
                    aria-label="Start a new chat"
                    className="p-1.5 text-paper/40 hover:text-paper transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  className="p-1.5 text-paper/40 hover:text-paper transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={openHome}
              className="group flex items-center gap-2 border-b border-paper/10 px-4 py-2.5 text-left text-xs text-paper/70 hover:bg-paper/5 hover:text-signal transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Visit Demi&apos;s home
              <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 text-sm leading-relaxed"
            >
              <Message role="assistant">
                Hi! Ask me about Nasiru&apos;s projects, skills, or how he works. I can also pass him a
                message.
              </Message>

              {chat.messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="rounded-full border border-paper/15 px-3 py-1.5 text-xs text-paper/70 hover:border-signal hover:text-signal transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {chat.messages.map((message, index) =>
                message.content ? (
                  <Message key={index} role={message.role}>
                    {message.role === "assistant" ? renderContent(message.content) : message.content}
                  </Message>
                ) : (
                  <p key={index} className="text-xs text-paper/40">
                    Demi is thinking...
                  </p>
                )
              )}

              {chat.atLimit && !chat.busy && (
                <p className="text-xs text-paper/40">
                  This chat has reached its length limit.{" "}
                  <button
                    type="button"
                    onClick={chat.reset}
                    className="text-signal hover:text-signal-hover underline"
                  >
                    Start a new one
                  </button>{" "}
                  to keep going.
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              className="flex items-end gap-2 border-t border-paper/10 px-4 py-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    submit(input)
                  }
                }}
                rows={1}
                maxLength={MAX_CHARS}
                disabled={chat.atLimit}
                placeholder={chat.atLimit ? "Start a new chat to continue" : "Ask Demi something"}
                aria-label="Message Demi"
                className="flex-1 resize-none bg-transparent py-1.5 text-base sm:text-sm text-paper placeholder:text-paper/30 outline-none max-h-24 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chat.busy || chat.atLimit || !input.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal text-ink hover:bg-signal-hover disabled:opacity-30 disabled:hover:bg-signal transition-colors"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>

            {/* speech-bubble tail pointing down at Demi */}
            <span
              aria-hidden="true"
              className="absolute -bottom-2 right-8 hidden sm:block h-4 w-4 rotate-45 bg-[#1A1716] border-r border-b border-paper/15"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{homeOpen && <DemiHome onClose={closeHome} />}</AnimatePresence>

      <motion.div
        className="fixed left-0 top-0 z-50"
        // While the visitor is inside the house, Demi is in there with them.
        style={{ x, y, width: SIZE, height: SIZE, display: homeOpen || (chatOpen && area.mobile) ? "none" : undefined }}
      >
        <AnimatePresence>
          {line && !chatOpen && (
            <motion.div
              key={line}
              role="status"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className={`pointer-events-none absolute bottom-full mb-2 w-max max-w-[13rem] rounded-2xl bg-paper px-3 py-2 text-xs leading-snug text-ink shadow-lg shadow-black/40 ${
                bubbleOnLeft ? "left-0 rounded-bl-sm" : "right-0 rounded-br-sm"
              }`}
            >
              {line}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onTap}
          onPointerMove={onPet}
          aria-label={label}
          aria-expanded={chatOpen}
          style={{ rotate: lean }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="block h-full w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <DemiSprite mood={mood} night={night} moving={moving} eyeX={eyeX} eyeY={eyeY} />
        </motion.button>
      </motion.div>
    </>
  )
}

function Message({ role, children }: { role: ChatMessage["role"]; children: React.ReactNode }) {
  return role === "assistant" ? (
    <div className="max-w-[92%] whitespace-pre-wrap break-words text-paper/85">{children}</div>
  ) : (
    <div className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-signal/15 px-3 py-1.5 text-paper">
      {children}
    </div>
  )
}
