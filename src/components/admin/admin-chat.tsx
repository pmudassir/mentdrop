"use client"

import * as React from "react"
import { Bot, X } from "lucide-react"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "swadesh-admin",
  tokenUrl: "/api/an-token",
})

export function AdminChat() {
  const [open, setOpen] = React.useState(false)
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-tertiary text-on-tertiary shadow-xl flex items-center justify-center hover:bg-tertiary/90 transition-colors"
        aria-label="AI Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-xl overflow-hidden border border-surface-container-highest">
          <div className="bg-tertiary text-on-tertiary px-4 py-3 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span className="text-title-sm">Admin Assistant</span>
          </div>
          <div className="h-80 overflow-y-auto bg-surface-container-lowest">
            <AgentChat
              messages={messages}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSend={(msg: any) => sendMessage({ text: typeof msg === "string" ? msg : (msg?.content ?? "") })}
              status={status}
              onStop={stop}
              error={error ?? undefined}
            />
          </div>
        </div>
      )}
    </>
  )
}
