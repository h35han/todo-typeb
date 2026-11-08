import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:hover:bg-primary/90",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border bg-background",
      },
      size: {
        default: "size-10",
        sm: "size-9",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "lg",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
