import { useMemo } from "react"
import { Link } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"

import StatusBadge from "@/components/common/StatusBadge"
import { FORMAT_MAP } from "@/constant/formats.js"
import { PLATFORMS } from "@/constant/platforms.js"
import { getAttentionItems, getUpcoming } from "@/features/dashboard/dashboardUtils.js"
import { useContents } from "@/hooks/useContents.js"
import { formatCompact } from "@/lib/format.js"
import { cardClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

function StatCard({ label, value, note }) {
  return (
    <div className={cn(cardClass, "p-5")}>
      <p className="text-sm text-muted-ink">{label}</p>
      <p className="mt-1.5 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted-ink">{note}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { data: contents } = useContents()

  const stats = useMemo(() => ({
    total: contents.length,
    channels: new Set(contents.map((c) => c.channel?.id ?? c.channel_id)).size,
    producing: contents.filter((c) => ["recording", "editing"].includes(c.status)).length,
    ready: contents.filter((c) => c.status === "ready").length,
    views: contents.some((c) => c.latest_views != null)
      ? contents.reduce((sum, c) => sum + (c.latest_views ?? 0), 0)
      : null,
  }), [contents])
  const upcoming = useMemo(() => getUpcoming(contents), [contents])
  const attention = useMemo(() => getAttentionItems(contents), [contents])

  return (
      <>
        <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total konten" value={stats.total} note={`di ${stats.channels} channel`} />
          <StatCard label="Dalam produksi" value={stats.producing} note="recording + editing" />
          <StatCard label="Siap tayang" value={stats.ready} note="status Ready" />
          <StatCard label="Total views" value={stats.views == null ? "-" : formatCompact(stats.views)} note="konten published" />
        </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className={cn(cardClass, "p-6")}>
              <h2 className="mb-2 text-lg font-extrabold text-ink">Jadwal tayang minggu ini</h2>
              {upcoming.length === 0 ? (
                <p className="py-6 text-sm text-muted-ink">Belum ada konten terjadwal dalam 7 hari ke depan.</p>
              ) : (
                <ul>
                  {upcoming.map((c) => {
                    const date = parseISO(c.scheduled_date)
                    return (
                      <li key={c.id} className="flex items-center gap-3 border-t border-surface-deep py-3">
                        <div className="flex size-12 flex-none flex-col items-center justify-center rounded-xl bg-chip leading-none">
                          <span className="text-base font-extrabold text-ink">{format(date, "d")}</span>
                          <span className="text-[10px] font-bold text-muted-ink">
                            {format(date, "MMM", { locale: localeId }).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link to={`/content/${c.id}`} className="block truncate text-sm font-bold text-ink hover:underline">
                            {c.title}
                          </Link>
                          <p className="text-xs text-muted-ink">
                            {PLATFORMS[c.channel?.platform]?.label} · {FORMAT_MAP[c.format_type]?.label}
                          </p>
                        </div>
                        <StatusBadge status={c.status} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <section className={cn(cardClass, "p-6")}>
              <h2 className="mb-2 text-lg font-extrabold text-ink">Perlu perhatian</h2>
              {attention.length === 0 ? (
                <p className="py-6 text-sm text-muted-ink">Semua konten aman. Tidak ada yang perlu ditindaklanjuti.</p>
              ) : (
                <ul>
                  {attention.map((item) => (
                    <li key={item.id} className="border-t border-surface-deep py-3 text-sm">
                      <Link to={`/content/${item.id}`} className="font-bold text-ink hover:underline">{item.title}</Link>
                      <p className="text-muted-ink">{item.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
)}