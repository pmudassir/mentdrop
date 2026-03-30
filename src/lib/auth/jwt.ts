import { SignJWT, jwtVerify, type JWTPayload } from "jose"

export type SessionPayload = JWTPayload & {
  userId: string
  phone: string
  role: "customer" | "admin"
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me")
const ISSUER = "swadesh"
const AUDIENCE = "swadesh-app"
const EXPIRY = "7d"

export async function signToken(payload: Omit<SessionPayload, "iat" | "exp" | "iss" | "aud">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(EXPIRY)
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    })
    return payload as SessionPayload
  } catch {
    return null
  }
}
