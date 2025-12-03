import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/30",
        outline: "bg-transparent border-primary/30 text-foreground/70",
        neon: "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(34,197,94,0.4)]",
        ghost: "border-transparent bg-transparent text-foreground/60",
      },
      intent: {
        primary: "border-primary/30 text-primary bg-primary/10",
        secondary: "border-secondary/30 text-secondary bg-secondary/10",
        accent: "border-accent/30 text-accent bg-accent/10",
        danger: "border-red-500/30 text-red-500 bg-red-500/10",
        warning: "border-yellow-500/30 text-yellow-500 bg-yellow-500/10",
        info: "border-blue-500/30 text-blue-500 bg-blue-500/10",
        success: "border-green-500/30 text-green-500 bg-green-500/10",
      },
      size: {
        sm: "h-5 text-[9px]",
        md: "h-6 text-[10px]",
        lg: "h-7 text-xs px-3",
      }
    },
    compoundVariants: [
      {
        variant: "neon",
        intent: "primary",
        class: "shadow-[0_0_10px_rgba(34,197,94,0.4)] border-primary/50",
      },
      {
        variant: "neon",
        intent: "danger",
        class: "shadow-[0_0_10px_rgba(239,68,68,0.4)] border-red-500/50",
      },
      {
        variant: "neon",
        intent: "info",
        class: "shadow-[0_0_10px_rgba(59,130,246,0.4)] border-blue-500/50",
      }
    ],
    defaultVariants: {
      variant: "default",
      intent: "primary",
      size: "md",
    },
  }
);

export interface CyberBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function CyberBadge({ className, variant, intent, size, icon, children, ...props }: CyberBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, intent, size }), className)} {...props}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
}
