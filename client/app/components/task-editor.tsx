import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Loader2, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Textarea } from "~/components/ui/textarea"

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong"
}

function resize(el: HTMLTextAreaElement | null, maxRatio: number) {
  if (!el) return

  el.style.height = "auto"
  const max = window.innerHeight * maxRatio
  el.style.height = `${Math.min(el.scrollHeight, max)}px`
  el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
}

interface TaskEditorProps {
  mode: "create" | "edit"
  initialTitle: string
  initialDescription: string
  onBack: () => void
  onDiscardDraft?: () => void
  onSave: (title: string, description: string) => Promise<void>
  onDelete?: () => Promise<void>
}

export function TaskEditor({
  mode,
  initialTitle,
  initialDescription,
  onBack,
  onDiscardDraft,
  onSave,
  onDelete,
}: TaskEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    resize(titleRef.current, 0.45)
    resize(descriptionRef.current, 0.35)
  }, [title, description])

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [])

  const handleSave = async () => {
    if (!title.trim() || saving) return

    setSaving(true)
    setError(null)

    try {
      await onSave(title, description)
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || deleting) return

    setDeleting(true)
    setError(null)

    try {
      await onDelete()
      setConfirmOpen(false)
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center px-3 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Go back"
          onClick={onBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
        <Textarea
          ref={titleRef}
          rows={1}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          aria-label="Task title"
          className="min-h-[1.3em] overflow-hidden text-[24px] leading-[1.3]"
        />
        <Textarea
          ref={descriptionRef}
          rows={1}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a description…"
          aria-label="Task description"
          className="mt-4 min-h-[1.5em] overflow-hidden text-[16px] leading-normal"
        />
      </div>

      {error && <p className="px-5 pb-1 text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between px-5 py-4">
        {/* Edit deletes the task; create discards the draft with the same control. */}
        {mode === "edit" ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete task"
            className="size-12 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
            disabled={deleting}
            onClick={() => {
              setError(null)
              setConfirmOpen(true)
            }}
          >
            {deleting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Trash2 className="size-5" />
            )}
          </Button>
        ) : onDiscardDraft ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Discard draft"
            className="size-12 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
            onClick={onDiscardDraft}
          >
            <Trash2 className="size-5" />
          </Button>
        ) : (
          <span />
        )}

        <Button
          size="icon"
          aria-label="Save task"
          className="size-12 rounded-full"
          disabled={!title.trim() || saving}
          onClick={() => void handleSave()}
        >
          {saving ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Check className="size-5" />
          )}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <AlertDialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={deleting}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={() => void handleDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
