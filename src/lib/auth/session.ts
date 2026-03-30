import { cookies } from "next/headers"
import { verifyToken, signToken, type SessionPayload } from "./jwt"

const SESSION_COOKIE = "swadesh_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(payload: {
  userId: string
  phone: string
  role: "customer" | "admin"
}): Promise<string> {
  const token = await signToken(payload)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null
  return verifyToken(token)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
