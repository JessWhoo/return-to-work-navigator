import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

/**
 * Brand buttons — built from the design system's Buttons blocks.
 * The resting + interactive states live in src/index.css (.nv-btn…),
 * ported 1:1 from the design system's <style> blocks.
 */
const buttonVariants = cva(
  "nv-btn [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "nv-btn--destructive",
        destructiveOutline: "nv-btn--destructive-outline",
        outline: "nv-btn--outline",
        secondary: "nv-btn--secondary",
        ghost: "nv-btn--text",
        onGradient: "nv-btn--on-gradient",
        link: "nv-btn--text underline underline-offset-4",
      },
      size: {
        default: "",
        sm: "nv-btn--sm",
        lg: "nv-btn--lg",
        icon: "nv-btn--icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }