import { Outlet } from "react-router"
import { TaskProvider } from "~/lib/task-store"

export default function ProvidersLayout() {
  return (
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  )
}
