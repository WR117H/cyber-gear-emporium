
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.03] active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90 shadow-md hover:shadow-lg transition-shadow duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline:
          "border border-white bg-transparent text-white hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg transition-shadow duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-colors duration-300",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-300",
        cyber: "bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy rounded-full shadow-[0_0_10px_rgba(0,255,255,0.4)] hover:shadow-[0_0_18px_rgba(0,255,255,0.7)] transition-all duration-300 animate-pulse-glow",
        github: "bg-white text-black hover:bg-white/90 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-[14px] px-4",
        lg: "h-12 rounded-[14px] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
