import { Check } from "lucide-react"
import { STATUSES } from "@/constant/status"
import { cardClass } from "@/lib/styles"
import { cn } from "@/lib/utils"

export default function StatusStepper({ status }) {
  const currentIndex = STATUSES.findIndex((item) => item.value === status)

  return (
    <ol aria-label="Tahapan konten" className={cn(cardClass, "mb-4 flex flex-wrap gap-2 p-4")}>
      {STATUSES.map((item, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex
        return (
          <li
            key={item.value}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold",
              isCurrent && cn(item.className, "ring-2 ring-brand-violet/40"),
              isDone && "bg-surface-deep text-muted-ink",
              !isCurrent && !isDone && "border border-line bg-card text-muted-ink"
            )}
          >
            {isDone ? <Check className="size-3.5" aria-hidden="true" /> : <span>{index + 1}</span>}
            {item.label}
          </li>
        )
      })}
    </ol>
  )
}
