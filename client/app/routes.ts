import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  layout("routes/providers.tsx", [
    layout("routes/shell.tsx", [
      index("routes/home.tsx"),
      route("tasks/new", "routes/task-new.tsx"),
      route("tasks/:id", "routes/task-edit.tsx"),
    ]),
  ]),
] satisfies RouteConfig
