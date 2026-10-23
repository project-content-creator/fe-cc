import { STATUS_MAP } from "@/constant/status"
import { cn } from "@/lib/utils"

export default function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status]
  if (!config) return null

  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-bold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
