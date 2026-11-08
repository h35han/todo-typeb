import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type { SwitchRootProps } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({ className, ...props }: SwitchRootProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform group-data-[checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
