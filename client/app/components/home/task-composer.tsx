import { useEffect, useRef, type KeyboardEvent } from "react"
import { Loader2, Maximize2, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"

interface TaskComposerProps {
  draft: string
  onChange: (value: string) => void
  onAdd: () => Promise<boolean>
  onExpand: () => void
  adding: boolean
}

export function TaskComposer({
  draft,
  onChange,
  onAdd,
  onExpand,
  adding,
}: TaskComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = "auto"
    const max = window.innerHeight * 0.4
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
  }

  useEffect(() => {
    resize()
  }, [draft])

  const handleAdd = async () => {
    const added = await onAdd()
    if (!added) return

    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      event.preventDefault()
      void handleAdd()
    }
  }

  return (
    <div className="shrink-0 border-t border-border px-5 py-3">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={draft}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a task…"
        aria-label="New task"
        className="min-h-[1.4em] overflow-hidden text-[18px] leading-[1.4]"
      />
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          aria-label="Expand editor"
          className="size-12 rounded-full"
          onClick={onExpand}
        >
          <Maximize2 className="size-4" />
        </Button>
        <Button
          size="icon"
          aria-label="Add task"
          className="size-12 rounded-full"
          disabled={!draft.trim() || adding}
          onClick={() => void handleAdd()}
        >
          {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-5" />}
        </Button>
      </div>
    </div>
  )
}
