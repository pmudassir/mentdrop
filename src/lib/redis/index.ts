import { Redis } from "@upstash/redis"

// ── Dev fallback: in-memory store when Redis is not configured ──
const IS_PLACEHOLDER = !process.env.UPSTASH_REDIS_REST_URL ||
  process.env.UPSTASH_REDIS_REST_URL.includes("placeholder")

const memStore = new Map<string, { value: unknown; expiresAt: number | null }>()

const memRedis = {
  async incr(key: string): Promise<number> {
    const entry = memStore.get(key)
    const val = entry && (!entry.expiresAt || Date.now() < entry.expiresAt)
      ? (entry.value as number) + 1
      : 1
    memStore.set(key, { value: val, expiresAt: null })
    return val
  },
  async expire(key: string, seconds: number): Promise<void> {
    const entry = memStore.get(key)
    if (entry) memStore.set(key, { ...entry, expiresAt: Date.now() + seconds * 1000 })
  },
  async set(key: string, value: unknown, opts?: { ex?: number }): Promise<void> {
    memStore.set(key, {
      value,
      expiresAt: opts?.ex ? Date.now() + opts.ex * 1000 : null,
    })
  },
  async get<T>(key: string): Promise<T | null> {
    const entry = memStore.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      memStore.delete(key)
      return null
    }
    return entry.value as T
  },
  async del(key: string): Promise<void> {
    memStore.delete(key)
  },
}

const upstashRedis = IS_PLACEHOLDER
  ? null
  : new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

// Unified redis interface — uses real Upstash or in-memory fallback
export const redis = IS_PLACEHOLDER ? memRedis : upstashRedis!

// Key prefixes
export const REDIS_KEYS = {
  otp: (phone: string) => `otp:${phone}` as const,
  otpAttempts: (phone: string) => `otp_attempts:${phone}` as const,
  session: (userId: string) => `session:${userId}` as const,
  stockReservation: (variantId: string, sessionId: string) =>
    `stock_reserve:${variantId}:${sessionId}` as const,
  rateLimit: (key: string) => `rate_limit:${key}` as const,
} as const

// TTLs in seconds
export const REDIS_TTL = {
  otp: 300,
  otpAttempts: 3600,
  stockReservation: 900,
  rateLimit: 60,
} as const
