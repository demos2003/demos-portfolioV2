"use server"

import { redirect } from "next/navigation"
import { verifyCredentials, setSessionCookie } from "@/lib/auth"

export type LoginState = {
  error?: string
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  let valid = false
  try {
    valid = await verifyCredentials(email, password)
  } catch {
    return { error: "Server is missing admin credentials configuration" }
  }

  if (!valid) {
    return { error: "Invalid email or password" }
  }

  await setSessionCookie(email)
  redirect("/admin")
}
