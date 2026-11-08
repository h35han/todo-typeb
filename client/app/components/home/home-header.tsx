import { AlignLeft, Equal } from "lucide-react"
import { Toggle } from "~/components/ui/toggle"

interface HomeHeaderProps {
  showDescriptions: boolean
  onShowDescriptionsChange: (value: boolean) => void
  hideCompleted: boolean
  onHideCompletedChange: (value: boolean) => void
}

export function HomeHeader({
  showDescriptions,
  onShowDescriptionsChange,
  hideCompleted,
  onHideCompletedChange,
}: HomeHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <h1 className="text-[36px] leading-none font-medium">Tasks</h1>
      <div className="flex items-center gap-2">
        <Toggle
          variant="outline"
          pressed={showDescriptions}
          onPressedChange={onShowDescriptionsChange}
          aria-label={showDescriptions ? "Hide descriptions" : "Show descriptions"}
          aria-pressed={showDescriptions}
          className="size-12 rounded-full"
        >
          <AlignLeft className="size-5" />
        </Toggle>
        <Toggle
          pressed={hideCompleted}
          onPressedChange={onHideCompletedChange}
          aria-label="Hide completed tasks"
          aria-pressed={hideCompleted}
          className="size-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
        >
          <Equal className="size-5" />
        </Toggle>
      </div>
    </header>
  )
}
