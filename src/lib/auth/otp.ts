import { redis, REDIS_KEYS, REDIS_TTL } from "@/lib/redis"

const MAX_OTP_ATTEMPTS = 5
const IS_DEV = process.env.NODE_ENV !== "production"

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Rate limit check
    const attemptsKey = REDIS_KEYS.otpAttempts(phone)
    const attempts = await redis.incr(attemptsKey)
    if (attempts === 1) {
      await redis.expire(attemptsKey, REDIS_TTL.otpAttempts)
    }
    if (attempts > MAX_OTP_ATTEMPTS) {
      return { success: false, error: "Too many OTP requests. Try again in 1 hour." }
    }

    const otp = IS_DEV ? "123456" : generateOtp() // fixed OTP in dev for easy testing
    await redis.set(REDIS_KEYS.otp(phone), otp, { ex: REDIS_TTL.otp })

    if (!IS_DEV && process.env.MSG91_AUTH_KEY) {
      const response = await fetch(
        `https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phone}&authkey=${process.env.MSG91_AUTH_KEY}`,
        { method: "POST" }
      )
      if (!response.ok) {
        return { success: false, error: "Failed to send OTP. Please try again." }
      }
    } else {
      // Dev mode: OTP is always 123456
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.log(`\n🔑 [DEV OTP] Phone: ${phone} → OTP: ${otp}\n`)
      }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: "SMS service error. Please try again." }
  }
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const storedOtp = await redis.get<string>(REDIS_KEYS.otp(phone))

    if (!storedOtp) {
      return { valid: false, error: "OTP expired. Please request a new one." }
    }

    if (storedOtp !== otp) {
      return { valid: false, error: "Invalid OTP. Please try again." }
    }

    await redis.del(REDIS_KEYS.otp(phone))
    return { valid: true }
  } catch {
    // In dev with memory store, just accept the hardcoded OTP
    if (IS_DEV && otp === "123456") return { valid: true }
    return { valid: false, error: "Verification failed. Please try again." }
  }
}
