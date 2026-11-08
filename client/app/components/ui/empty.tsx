import * as React from "react"
import { cn } from "cn"

function Empty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

function EmptyMedia({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-medium", className)} {...props} />
}

function EmptyDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-xs font-sans text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
}
