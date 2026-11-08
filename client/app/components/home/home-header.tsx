import { Rows2, Cone } from "lucide-react"
import { Toggle } from "~/components/ui/toggle"

interface HomeHeaderProps {
  ready: boolean
  showDescriptions: boolean
  onShowDescriptionsChange: (value: boolean) => void
  hideCompleted: boolean
  onHideCompletedChange: (value: boolean) => void
}

export function HomeHeader({
  ready,
  showDescriptions,
  onShowDescriptionsChange,
  hideCompleted,
  onHideCompletedChange,
}: HomeHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-5 pb-8">
      <h1 className="text-[36px] leading-none font-medium">Tasks</h1>
      <div className="flex items-center gap-2">
        {ready ? (
          <Toggle
            pressed={showDescriptions}
            onPressedChange={onShowDescriptionsChange}
            aria-label="Show descriptions"
            aria-pressed={showDescriptions}
            title="Show descriptions"
          	size="sm"
          >
            <Rows2 className="size-5" />
          </Toggle>
        ) : (
          <span
            className="size-12 rounded-full border border-border bg-background"
            aria-hidden="true"
          />
        )}
        {ready ? (
          <Toggle
            pressed={hideCompleted}
            onPressedChange={onHideCompletedChange}
            aria-label="Hide completed tasks"
            aria-pressed={hideCompleted}
            title="Hide completed tasks"
            size="sm"
          >
            <Cone className="size-5" />
          </Toggle>
        ) : (
          <span
            className="size-12 rounded-full border border-border bg-background"
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  )
}
