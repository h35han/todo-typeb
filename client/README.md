# TODO App Frontend

A React Router frontend for the TODO app, built with React, TypeScript, Tailwind CSS, and shadcn/ui components on Base UI primitives.

## Requirements

- Node.js 20.19 or newer
- pnpm
- The backend API running on port `8080`

## Setup

Install dependencies:

```bash
pnpm install
```

Optionally create an environment file:

```bash
cp .env.example .env
```

Start the dev server:

```bash
pnpm dev
```

In development, Vite proxies `/api` requests to `http://localhost:8080`. Set `VITE_API_URL` in `.env` to point at another API origin.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — type-check and build for production
- `pnpm typecheck` — run React Router typegen and TypeScript

## Screens

- Home: task list, completed filter, and title-only mini editor
- View/Edit: edit the title and description, discard changes, or delete the task
- Create: add a task with a title and optional description

## Features

- Loads todos from the backend API
- Newest tasks appear first
- Creates, updates, completes, and deletes todos through the API
- Description editing in the maximized editor
- Header toggles for descriptions and completed tasks, persisted in localStorage
- Trash button discards the draft in create mode; the back arrow discards unsaved edits
- Optimistic toggle and delete updates with rollback on failure
- Empty, loading, and error states
- Mobile-first responsive shell
- shadcn/Base UI controls

## Assumptions and Limitations

- The backend must be running before the frontend loads tasks.
- The mini editor edits the title only. Use the expanded editor to add a description.
- The backend limits titles to 120 characters and descriptions to 1000 characters.
- The mini editor draft is kept in memory and is not persisted.
- There is no authentication; the app manages one shared list.
