import StatusBadge from "@/components/common/StatusBadge"
import { STATUSES } from "@/constant/status.js"
import KanbanCard from "@/features/contents/KanbanCard"

// `statuses`: kolom yang ditampilkan (disesuaikan dengan role: creator 3 kolom, editor 2 kolom, admin 6 kolom).
export default function KanbanBoard({ contents, statuses = STATUSES }) {
  return (
    <div
      className="grid gap-3 overflow-x-auto pb-2"
      style={{ gridTemplateColumns: `repeat(${statuses.length}, minmax(200px, 1fr))` }}
    >
      {statuses.map((status) => {
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
