"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, MapPin, Star } from "lucide-react"
import Link from "next/link"
import {
  getAddressesAction,
  saveAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  type Address,
} from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AddressForm = {
  label: string; name: string; phone: string
  line1: string; line2: string; city: string
  state: string; pincode: string; isDefault: boolean
}

const EMPTY_FORM: AddressForm = {
  label: "Home", name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", isDefault: false,
}

export default function AddressesPage() {
  const router = useRouter()
  const [addressList, setAddressList] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<AddressForm>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getAddressesAction().then((list) => {
      if (list.length === 0 && !showForm) setAddressList([])
      else setAddressList(list)
    })
  }, [showForm])

  function validateForm(): boolean {
    const errors: Partial<AddressForm> = {}
    if (!form.name.trim()) errors.name = "Name is required"
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) errors.phone = "Enter a valid 10-digit number"
    if (!form.line1.trim()) errors.line1 = "Address is required"
    if (!form.city.trim()) errors.city = "City is required"
    if (!form.state.trim()) errors.state = "State is required"
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) errors.pincode = "Enter a valid 6-digit pincode"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSave() {
    if (!validateForm()) return
    startTransition(async () => {
      const result = await saveAddressAction({
        label: form.label,
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        isDefault: form.isDefault,
      })
      if (result.success) {
        setShowForm(false)
        setForm(EMPTY_FORM)
        const updated = await getAddressesAction()
        setAddressList(updated)
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAddressAction(id)
      setAddressList((prev) => prev.filter((a) => a.id !== id))
    })
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      await setDefaultAddressAction(id)
      setAddressList((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/account" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-label-md mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Account
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-serif text-2xl font-semibold text-on-surface">Addresses</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">Manage your saved delivery addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setForm(EMPTY_FORM) }}
            className="flex items-center gap-1.5 text-label-md text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      {/* Saved addresses */}
      {!showForm && (
        <>
          {addressList.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-body-md text-on-surface-variant">No saved addresses yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-label-md text-primary hover:underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {addressList.map((addr) => (
                <div
                  key={addr.id}
                  className={cn(
                    "bg-surface-container-low rounded-2xl p-4",
                    addr.isDefault && "ring-2 ring-primary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-label-sm font-semibold text-on-surface-variant/60 uppercase tracking-wider">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-body-md text-on-surface font-medium">{addr.name}</p>
                      <p className="text-body-sm text-on-surface-variant">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="p-2 rounded-xl text-on-surface-variant/50 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Set as default"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-2 rounded-xl text-on-surface-variant/50 hover:text-error hover:bg-error-container/20 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add address form */}
      {showForm && (
        <div>
          <h2 className="text-title-md text-on-surface mb-5">New Address</h2>
          <div className="flex flex-col gap-4">
            {/* Label tabs */}
            <div>
              <p className="text-label-sm text-on-surface-variant/70 uppercase tracking-wider mb-2">Label</p>
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    key={lbl}
                    onClick={() => setForm((f) => ({ ...f, label: lbl }))}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-label-md transition-colors",
                      form.label === lbl
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Ananya Sharma" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} />
              <Input label="Phone" placeholder="9876543210" type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={formErrors.phone} />
            </div>
            <Input label="Address Line 1" placeholder="House/Flat, Street" value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} error={formErrors.line1} />
            <Input label="Address Line 2 (Optional)" placeholder="Landmark, Area" value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="City" placeholder="Mumbai" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} error={formErrors.city} />
              <Input label="State" placeholder="Maharashtra" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} error={formErrors.state} />
              <Input label="Pincode" placeholder="400001" maxLength={6} value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} error={formErrors.pincode} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-body-md text-on-surface">Set as default address</span>
            </label>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-primary hover:bg-primary/90 text-on-primary rounded-full"
              >
                {isPending ? "Saving…" : "Save Address"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setFormErrors({}) }}
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
