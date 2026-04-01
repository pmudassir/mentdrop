"use client"

import * as React from "react"

export function NewsletterBlock() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <section className="bg-inverse-surface py-16 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-label-md tracking-[0.18em] uppercase text-inverse-on-surface/40 mb-3">
          The Inner Circle
        </p>
        <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-inverse-on-surface mb-4">
          Join the Atelier
        </h2>
        <p className="text-body-lg text-inverse-on-surface/60 mb-8 leading-relaxed">
          Be the first to know about new arrivals, exclusive collections, and heritage stories.
        </p>
        {submitted ? (
          <p className="text-inverse-on-surface/70 text-body-lg">
            ✓ You're on the list. Welcome to Swadesh.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-inverse-on-surface/20 text-inverse-on-surface placeholder:text-inverse-on-surface/30 focus:outline-none focus:border-[#D4A574] text-body-md transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#D4A574] hover:bg-[#C49060] text-white text-body-md font-medium transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
