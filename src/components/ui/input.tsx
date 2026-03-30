import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.ComponentProps<"input"> & {
  label?: string
  error?: string
}

function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? React.useId()

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            "w-full bg-transparent pb-2 text-body-lg text-on-surface",
            "border-b-2 border-surface-container-highest",
            "transition-colors duration-200",
            "placeholder:text-outline",
            "focus:border-primary focus:outline-none",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  )
}

export { Input }
