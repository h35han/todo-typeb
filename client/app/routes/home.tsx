import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { ErrorBanner } from "~/components/home/error-banner"
import { HomeHeader } from "~/components/home/home-header"
import { TaskComposer } from "~/components/home/task-composer"
import { TaskList } from "~/components/home/task-list"
import type { Task } from "~/lib/api"
import { useTaskStore } from "~/lib/task-store"

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong"
}

export default function Home() {
  const navigate = useNavigate()
  const {
    tasks,
    draft,
    loading,
    error,
    clearError,
    setDraft,
    reload,
    addTask,
    toggleTask,
  } = useTaskStore()

  const [hideCompleted, setHideCompleted] = useState(false)
  const [showDescriptions, setShowDescriptions] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const visibleTasks = hideCompleted ? tasks.filter((task) => !task.done) : tasks
  // With tasks on screen, show load errors in the banner. Otherwise TaskList owns the error state.
  const banner = actionError ?? (tasks.length > 0 ? error : null)

  const handleAdd = async () => {
    if (!draft.trim() || adding) return false

    setAdding(true)
    setActionError(null)

    try {
      await addTask(draft)
      setDraft("")

      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        })
      })

      return true
    } catch (err) {
      setActionError(messageOf(err))
      return false
    } finally {
      setAdding(false)
    }
  }

  const handleToggle = async (task: Task) => {
    setActionError(null)

    try {
      await toggleTask(task.id)
    } catch (err) {
      setActionError(messageOf(err))
    }
  }

  const handleDismissError = () => {
    setActionError(null)
    clearError()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <HomeHeader
        showDescriptions={showDescriptions}
        onShowDescriptionsChange={setShowDescriptions}
        hideCompleted={hideCompleted}
        onHideCompletedChange={setHideCompleted}
      />

      {banner && (
        <ErrorBanner
          message={banner}
          onRetry={error && !actionError ? () => void reload() : undefined}
          onDismiss={handleDismissError}
        />
      )}

      <div ref={listRef} className="flex-1 overflow-y-auto pb-2">
        <TaskList
          tasks={tasks}
          visibleTasks={visibleTasks}
          loading={loading}
          error={error}
          showDescriptions={showDescriptions}
          onToggle={handleToggle}
          onOpen={(task) => navigate(`/tasks/${task.id}`)}
          onShowCompleted={() => setHideCompleted(false)}
          onRetry={() => void reload()}
        />
      </div>

      <TaskComposer
        draft={draft}
        onChange={setDraft}
        onAdd={handleAdd}
        onExpand={() => navigate("/tasks/new")}
        adding={adding}
      />
    </div>
  )
}
