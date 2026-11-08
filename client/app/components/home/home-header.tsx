import { AlignLeft, Equal } from "lucide-react"
import { Switch } from "~/components/ui/switch"

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
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <h1 className="text-[36px] leading-none font-medium">Tasks</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <AlignLeft className="size-4 text-muted-foreground" aria-hidden="true" />
          {ready ? (
            <Switch
              checked={showDescriptions}
              onCheckedChange={onShowDescriptionsChange}
              aria-label="Show descriptions"
              title="Show descriptions"
            />
          ) : (
            <span className="h-6 w-11 rounded-full bg-input/60" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Equal className="size-4 text-muted-foreground" aria-hidden="true" />
          {ready ? (
            <Switch
              checked={hideCompleted}
              onCheckedChange={onHideCompletedChange}
              aria-label="Hide completed tasks"
              title="Hide completed tasks"
            />
          ) : (
            <span className="h-6 w-11 rounded-full bg-input/60" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  )
}
