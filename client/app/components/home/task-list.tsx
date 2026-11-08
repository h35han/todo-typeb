import { Equal, Inbox, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty"
import type { Task } from "~/lib/api"
import { TaskRow } from "./task-row"

interface TaskListProps {
  tasks: Task[]
  visibleTasks: Task[]
  loading: boolean
  error: string | null
  showDescriptions: boolean
  onToggle: (task: Task) => void
  onOpen: (task: Task) => void
  onShowCompleted: () => void
  onRetry: () => void
}

export function TaskList({
  tasks,
  visibleTasks,
  loading,
  error,
  showDescriptions,
  onToggle,
  onOpen,
  onShowCompleted,
  onRetry,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading tasks…
      </div>
    )
  }

  if (tasks.length === 0) {
    if (error) {
      return (
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyMedia>
              <Inbox className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Could not load tasks</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={onRetry}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia>
            <Inbox className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No tasks yet</EmptyTitle>
          <EmptyDescription>
            Write something below and tap + to add your first task.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (visibleTasks.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia>
            <Equal className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No open tasks</EmptyTitle>
          <EmptyDescription>Everything here is completed.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onShowCompleted}
          >
            Show completed
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div>
      {visibleTasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          showDescription={showDescriptions}
          onToggle={onToggle}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}
