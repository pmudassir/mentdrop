"use client"

import * as React from "react"
import { MessageCircle, X } from "lucide-react"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "swadesh-support",
  tokenUrl: "/api/an-token",
})

export function ChatFab() {
  const [open, setOpen] = React.useState(false)
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-glow text-on-primary shadow-xl flex items-center justify-center transition-transform active:scale-95"
        aria-label={open ? "Close chat" : "Chat with us"}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-xl overflow-hidden">
          <AgentChat
            messages={messages}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSend={(msg: any) => sendMessage({ text: typeof msg === "string" ? msg : (msg?.content ?? "") })}
            status={status}
            onStop={stop}
            error={error ?? undefined}
          />
        </div>
      )}
    </>
  )
}
