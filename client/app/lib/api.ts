const BASE_URL = import.meta.env.VITE_API_URL ?? ""

interface TodoResponse {
  _id: string
  title: string
  description: string
  done: boolean
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  done: boolean
  createdAt: string
}

function toTask(todo: TodoResponse): Task {
  return {
    id: todo._id,
    title: todo.title,
    description: todo.description,
    done: todo.done,
    createdAt: todo.createdAt,
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    })
  } catch {
    throw new Error("Could not reach the API")
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  return body as T
}

export const api = {
  list: async () => {
    const todos = await request<TodoResponse[]>("/api/todos")
    return todos.map(toTask).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },

  create: async (title: string, description: string) => {
    const todo = await request<TodoResponse>("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    })
    return toTask(todo)
  },

  update: async (id: string, title: string, description: string) => {
    const todo = await request<TodoResponse>(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
    })
    return toTask(todo)
  },

  toggle: async (id: string) => {
    const todo = await request<TodoResponse>(`/api/todos/${id}/done`, {
      method: "PATCH",
    })
    return toTask(todo)
  },

  remove: async (id: string) => {
    await request<void>(`/api/todos/${id}`, { method: "DELETE" })
  },
}
