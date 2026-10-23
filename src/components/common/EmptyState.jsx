import { cardClass } from "@/lib/styles"
import { cn } from "@/lib/utils"

export default function EmptyState({ title, description, children }) {
  return (
    <div className={cn(cardClass, "p-10 text-center")}>
      <p className="font-bold text-ink">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-ink">{description}</p>}
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  )
}
