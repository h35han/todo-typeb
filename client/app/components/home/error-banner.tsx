import { X } from "lucide-react"

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="mx-5 mb-2 flex items-start justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 font-sans text-sm text-destructive">
      <span>{message}</span>
      <div className="flex shrink-0 items-center gap-2">
        {onRetry && (
          <button type="button" className="underline" onClick={onRetry}>
            Retry
          </button>
        )}
        <button type="button" aria-label="Dismiss error" onClick={onDismiss}>
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
