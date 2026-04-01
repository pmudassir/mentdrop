"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getProfileAction, updateProfileAction } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getProfileAction().then((user) => {
      if (!user) { router.replace("/login"); return }
      setName(user.name ?? "")
      setEmail(user.email ?? "")
      setPhone(user.phone)
    })
  }, [router])

  function handleSave() {
    setError("")
    setSaved(false)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    startTransition(async () => {
      const result = await updateProfileAction({ name: name.trim() || undefined, email: email.trim() || undefined })
      if (result.success) setSaved(true)
      else setError(result.error)
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/account" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-label-md mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Account
      </Link>

      <h1 className="text-serif text-2xl font-semibold text-on-surface mb-1">My Profile</h1>
      <p className="text-body-sm text-on-surface-variant mb-8">Manage your personal details</p>

      <div className="flex flex-col gap-5">
        <div>
          <label className="text-label-sm text-on-surface-variant/70 uppercase tracking-wider block mb-1.5">
            Mobile Number
          </label>
          <div className="h-11 px-4 flex items-center bg-surface-container rounded-xl text-body-md text-on-surface-variant">
            {phone}
          </div>
          <p className="text-label-sm text-on-surface-variant/50 mt-1">Phone number cannot be changed</p>
        </div>

        <Input
          label="Full Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false) }}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setSaved(false) }}
        />

        {error && (
          <p className="text-label-sm text-error">{error}</p>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="text-label-md">Profile updated successfully</span>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary/90 text-on-primary rounded-full"
          size="lg"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
