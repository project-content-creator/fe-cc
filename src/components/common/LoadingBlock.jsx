import { cn } from "@/lib/utils.js"

export default function LoadingBlock({ className }) {
  return (
    <div
      role="status"
      aria-label="Memuat data..."
      className={cn("animate-pulse rounded-3xl bg-surface-deep", className)}
    />
  )
}
