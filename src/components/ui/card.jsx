import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Brand card surface — white surface, hairline border, large radius and the
 * mauve-tinted small shadow, lifting to the medium shadow on hover.
 * States live in src/index.css (.nv-card), ported from the design system.
 */
/** @type {React.ComponentType<any>} */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("nv-card", className)}
    {...props} />
))
Card.displayName = "Card"

/** @type {React.ComponentType<any>} */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

/** @type {React.ComponentType<any>} */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-heading font-bold leading-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

/** @type {React.ComponentType<any>} */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-brand-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

/** @type {React.ComponentType<any>} */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/** @type {React.ComponentType<any>} */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }