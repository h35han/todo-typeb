import { Link, Outlet } from "react-router"
import type { ReactNode } from "react"
import { buttonVariants } from "~/components/ui/button"

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex h-dvh w-full max-w-150 flex-col border-border bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:border-x">
        {children}
      </div>
    </div>
  )
}

export default function Shell() {
  return (
    <Frame>
      <Outlet />
    </Frame>
  )
}

export function ErrorBoundary() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-medium">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          This screen could not be loaded.
        </p>
        <Link to="/" className={buttonVariants()}>
          Back to tasks
        </Link>
      </div>
    </Frame>
  )
}
