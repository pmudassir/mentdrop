import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98] shadow-md",
        gold: "gold-glow text-on-primary hover:shadow-lg active:scale-[0.98]",
        secondary:
          "bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-[0.98]",
        outline:
          "ghost-border text-on-surface hover:bg-surface-container-low active:scale-[0.98]",
        ghost:
          "text-on-surface hover:bg-surface-container active:scale-[0.98]",
        destructive:
          "bg-error text-on-error hover:bg-error/90 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-4 text-body-sm rounded-full",
        md: "h-11 px-6 text-body-md rounded-full",
        lg: "h-13 px-8 text-body-lg rounded-full",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
