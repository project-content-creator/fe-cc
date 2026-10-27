import { cardClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

export default function StatCard({ label, value, note }) {
  return (
    <div className={cn(cardClass, "p-5")}>
      <p className="text-sm text-muted-ink">{label}</p>
      <p className="mt-1.5 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted-ink">{note}</p>
    </div>
  )
}
