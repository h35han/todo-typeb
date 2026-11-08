import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import type { CheckboxRootProps } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"
import { cn } from "cn"

function Checkbox({ className, ...props }: CheckboxRootProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="size-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
