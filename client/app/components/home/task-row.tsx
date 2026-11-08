import { Checkbox } from "~/components/ui/checkbox"
import { cn } from "cn"
import type { Task } from "~/lib/api"

interface TaskRowProps {
  task: Task
  showDescription: boolean
  onToggle: (task: Task) => void
  onOpen: (task: Task) => void
}

export function TaskRow({ task, showDescription, onToggle, onOpen }: TaskRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen(task)
        }
      }}
      className="flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors outline-none hover:bg-muted focus-visible:bg-muted active:bg-muted"
    >
      <span
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={task.done}
          onCheckedChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`}
          className="mt-0.5"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[18px] leading-[1.4] whitespace-pre-wrap break-words",
            task.done && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        {showDescription && task.description && (
          <p
            className={cn(
              "mt-1 text-sm leading-[1.4] whitespace-pre-wrap break-words text-muted-foreground",
              task.done && "line-through"
            )}
          >
            {task.description}
          </p>
        )}
      </div>
    </div>
  )
}
