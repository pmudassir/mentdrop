"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createSupplier } from "@/lib/actions/suppliers"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function AddSupplierForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [type, setType] = useState<"direct" | "platform">("direct")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createSupplier({
        name: name.trim(),
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        email: email.trim() || null,
        type,
        notes: notes.trim() || null,
        isActive: true,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setName("")
      setPhone("")
      setWhatsapp("")
      setEmail("")
      setType("direct")
      setNotes("")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-error-container px-4 py-3">
          <AlertCircle className="w-4 h-4 text-on-error-container shrink-0 mt-0.5" />
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="sup-name">
            Name <span className="text-error">*</span>
          </label>
          <input
            id="sup-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Supplier name"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="sup-phone">
            Phone
          </label>
          <input
            id="sup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="sup-whatsapp">
            WhatsApp
          </label>
          <input
            id="sup-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="sup-email">
            Email
          </label>
          <input
            id="sup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="supplier@example.com"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="sup-type">
            Type
          </label>
          <select
            id="sup-type"
            value={type}
            onChange={(e) => setType(e.target.value as "direct" | "platform")}
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
          >
            <option value="direct">Direct</option>
            <option value="platform">Platform</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-label-md text-on-surface-variant" htmlFor="sup-notes">
          Notes
        </label>
        <textarea
          id="sup-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes about this supplier…"
          className="w-full px-4 py-3 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary resize-y"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={isPending}>
          {isPending ? "Adding…" : "Add Supplier"}
        </Button>
      </div>
    </form>
  )
}
