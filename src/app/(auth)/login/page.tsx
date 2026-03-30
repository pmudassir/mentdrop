"use client"

import * as React from "react"
import { requestOtpAction, verifyOtpAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

type Step = "phone" | "otp"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>("phone")
  const [phone, setPhone] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await requestOtpAction(`91${phone.replace(/\D/g, "")}`)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }
    setStep("otp")
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await verifyOtpAction(`91${phone.replace(/\D/g, "")}`, otp)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-display-sm text-primary mb-2">Swadesh</h1>
          <p className="text-body-lg text-on-surface-variant">
            {step === "phone" ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
          </p>
          {step === "otp" && process.env.NODE_ENV !== "production" && (
            <p className="text-label-sm text-tertiary bg-tertiary-container px-3 py-2 rounded-xl mt-2">
              Dev mode — OTP is <strong>123456</strong>
            </p>
          )}
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <span className="text-body-lg text-on-surface-variant pb-2 border-b-2 border-surface-container-highest">
                +91
              </span>
              <div className="flex-1">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  inputMode="numeric"
                  autoFocus
                  error={error || undefined}
                />
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" disabled={loading || phone.replace(/\D/g, "").length !== 10}>
              {loading ? "Sending..." : "Get OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <Input
              label="Enter OTP"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              inputMode="numeric"
              autoFocus
              error={error || undefined}
            />
            <Button type="submit" variant="gold" size="lg" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
            <button
              type="button"
              onClick={() => { setStep("phone"); setOtp(""); setError("") }}
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
