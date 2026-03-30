import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({ label, value, subtext, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-container-lowest shadow-md px-6 py-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-label-md text-on-surface-variant truncate">{label}</p>
          <p className="text-display-sm text-on-surface mt-1 font-semibold leading-none">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="shrink-0 w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center">
            <Icon className="w-5 h-5 text-on-primary-container" />
          </div>
        )}
      </div>
      {subtext && (
        <p className="text-body-sm text-on-surface-variant">{subtext}</p>
      )}
    </div>
  )
}
