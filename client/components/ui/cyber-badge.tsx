import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        neon: "bg-black border-primary text-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
      },
      intent: {
        primary: "border-primary text-primary",
        accent: "border-accent text-accent shadow-[0_0_10px_rgba(59,130,246,0.3)]",
        success: "border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
        warning: "border-yellow-500 text-yellow-500",
        danger: "border-red-500 text-red-500",
        info: "border-blue-400 text-blue-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "neon",
        intent: "primary",
        class: "shadow-[0_0_10px_rgba(34,197,94,0.3)] border-primary text-primary",
      },
      {
        variant: "neon",
        intent: "accent",
        class: "shadow-[0_0_10px_rgba(59,130,246,0.3)] border-blue-500 text-blue-400",
      }
    ]
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
      intent?: "primary" | "accent" | "success" | "warning" | "danger" | "info"
    }

function CyberBadge({ className, variant, intent, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, intent, size }), className)} {...props} />
  )
}

export { CyberBadge, badgeVariants }
