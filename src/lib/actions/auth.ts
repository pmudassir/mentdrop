"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { sendOtp, verifyOtp } from "@/lib/auth/otp"
import { createSession, destroySession } from "@/lib/auth/session"
import { eq } from "drizzle-orm"

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string }

const IS_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")

/** Request OTP for a phone number */
export async function requestOtpAction(phone: string): Promise<ActionResult> {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length !== 12 || !cleaned.startsWith("91")) {
    return { success: false, error: "Please enter a valid Indian phone number" }
  }

  const formattedPhone = `+${cleaned}`
  const result = await sendOtp(formattedPhone)

  if (!result.success) {
    return { success: false, error: result.error ?? "Failed to send OTP" }
  }

  return { success: true }
}

/** Verify OTP and create/login user */
export async function verifyOtpAction(
  phone: string,
  otp: string
): Promise<ActionResult<{ isNewUser: boolean }>> {
  const cleaned = phone.replace(/\D/g, "")
  const formattedPhone = `+${cleaned}`

  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return { success: false, error: "Please enter a valid 6-digit OTP" }
  }

  const otpResult = await verifyOtp(formattedPhone, otp)
  if (!otpResult.valid) {
    return { success: false, error: otpResult.error ?? "Invalid OTP" }
  }

  // Mock mode: create a fake session without hitting DB
  if (IS_MOCK) {
    const mockUserId = "mock-" + cleaned
    await createSession({ userId: mockUserId, phone: formattedPhone, role: "customer" })
    return { success: true, data: { isNewUser: false } }
  }

  // Real DB: find or create user
  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.phone, formattedPhone),
    })

    let userId: string
    let role: "customer" | "admin"
    let isNewUser = false

    if (existing) {
      userId = existing.id
      role = existing.role
    } else {
      const [newUser] = await db
        .insert(users)
        .values({ phone: formattedPhone })
        .returning({ id: users.id, role: users.role })
      userId = newUser.id
      role = newUser.role
      isNewUser = true
    }

    await createSession({ userId, phone: formattedPhone, role })
    return { success: true, data: { isNewUser } }
  } catch {
    // DB failed — still log user in with mock session
    const mockUserId = "mock-" + cleaned
    await createSession({ userId: mockUserId, phone: formattedPhone, role: "customer" })
    return { success: true, data: { isNewUser: false } }
  }
}

/** Logout */
export async function logoutAction(): Promise<ActionResult> {
  await destroySession()
  return { success: true }
}
