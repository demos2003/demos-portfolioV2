import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

export const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("Missing SESSION_SECRET env var")
  return new TextEncoder().encode(secret)
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminEmail || !adminPasswordHash) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH env vars")
  }
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false
  return bcrypt.compare(password, adminPasswordHash)
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.email !== "string") return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export async function setSessionCookie(email: string) {
  const token = await createSessionToken(email)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}
