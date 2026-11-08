import * as React from "react"
import { cn } from "cn"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none border-0 bg-transparent p-0 outline-none placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
