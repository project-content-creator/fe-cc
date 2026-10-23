import StatusBadge from "@/components/common/StatusBadge"
import { STATUSES } from "@/constant/status"
import KanbanCard from "@/features/contents/KanbanCard"

export default function KanbanBoard({ contents }) {
  return (
    <div className="grid grid-cols-[repeat(6,minmax(180px,1fr))] gap-3 overflow-x-auto pb-2">
      {STATUSES.map((status) => {
        const items = contents.filter((content) => content.status === status.value)
        return (
          <section key={status.value} aria-label={status.label} className="min-h-64 rounded-3xl bg-surface-deep p-3">
            <header className="mb-3 flex items-center justify-between">
              <StatusBadge status={status.value} />
              <span className="text-xs text-muted-ink">{items.length}</span>
            </header>
            <div className="flex flex-col gap-2">
              {items.map((content) => (
                <KanbanCard key={content.id} content={content} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
