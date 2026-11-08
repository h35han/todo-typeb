import { useNavigate } from "react-router"
import { TaskEditor } from "~/components/task-editor"
import { useTaskStore } from "~/lib/task-store"

export default function TaskNew() {
  const navigate = useNavigate()
  const { draft, setDraft, addTask } = useTaskStore()

  return (
    <TaskEditor
      mode="create"
      initialTitle={draft}
      initialDescription=""
      onBack={() => navigate("/")}
      onDiscardDraft={() => {
        setDraft("")
        navigate("/")
      }}
      onSave={async (title, description) => {
        await addTask(title, description)
        setDraft("")
        navigate("/")
      }}
    />
  )
}
