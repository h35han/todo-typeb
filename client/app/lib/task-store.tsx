import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { api, type Task } from "./api"

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong"
}

interface TaskStore {
  tasks: Task[]
  draft: string
  loading: boolean
  error: string | null
  clearError: () => void
  setDraft: (value: string) => void
  reload: () => Promise<void>
  addTask: (title: string, description?: string) => Promise<Task>
  updateTask: (id: string, title: string, description: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskStore | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setTasks(await api.list())
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const clearError = useCallback(() => setError(null), [])

  const addTask = useCallback(async (title: string, description = "") => {
    const trimmed = title.trim()
    if (!trimmed) throw new Error("Task title is required")

    const task = await api.create(trimmed, description.trim())
    setTasks((prev) =>
      [task, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    )
    return task
  }, [])

  const updateTask = useCallback(
    async (id: string, title: string, description: string) => {
      const trimmed = title.trim()
      if (!trimmed) throw new Error("Task title is required")

      const updated = await api.update(id, trimmed, description.trim())
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
    },
    []
  )

  const toggleTask = useCallback(
    async (id: string) => {
      const current = tasks.find((task) => task.id === id)
      if (!current) return

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      )

      try {
        const updated = await api.toggle(id)
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        )
      } catch (err) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, done: current.done } : task
          )
        )
        throw err
      }
    },
    [tasks]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const previous = tasks
      setTasks((prev) => prev.filter((task) => task.id !== id))

      try {
        await api.remove(id)
      } catch (err) {
        setTasks(previous)
        throw err
      }
    },
    [tasks]
  )

  const value = useMemo(
    () => ({
      tasks,
      draft,
      loading,
      error,
      clearError,
      setDraft,
      reload,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
    }),
    [
      tasks,
      draft,
      loading,
      error,
      clearError,
      reload,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
    ]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTaskStore() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskStore must be used within TaskProvider")
  }
  return context
}
