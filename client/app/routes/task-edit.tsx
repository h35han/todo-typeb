import { Link, useNavigate, useParams } from "react-router"
import { Loader2 } from "lucide-react"
import { TaskEditor } from "~/components/task-editor"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "~/components/ui/empty"
import { useTaskStore } from "~/lib/task-store"

export default function TaskEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, loading, error, reload, updateTask, deleteTask } = useTaskStore()
  const task = tasks.find((item) => item.id === id)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading task…
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyTitle>{error ? "Could not load task" : "Task not found"}</EmptyTitle>
            <EmptyDescription>
              {error ?? "It may have been deleted or the link is wrong."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {error ? (
              <Button variant="outline" className="rounded-full" onClick={() => void reload()}>
                Try again
              </Button>
            ) : (
              <Link to="/" className={buttonVariants()}>
                Back to tasks
              </Link>
            )}
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <TaskEditor
      key={task.id}
      mode="edit"
      initialTitle={task.title}
      initialDescription={task.description}
      onBack={() => navigate(-1)}
      onSave={async (title, description) => {
        await updateTask(task.id, title, description)
        navigate("/")
      }}
      onDelete={async () => {
        await deleteTask(task.id)
        navigate("/")
      }}
    />
  )
}
