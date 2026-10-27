import { format, subDays } from "date-fns"
import { formatDate } from "@/lib/format.js"

export const PERIODS = [
  { value: "7", label: "7 hari terakhir" },
  { value: "30", label: "30 hari terakhir" },
  { value: "90", label: "90 hari terakhir" },
  { value: "all", label: "Semua waktu" },
]

// Metrik adalah "snapshot" (angka kumulatif per tanggal pencatatan). Aturan di sini:
// - Total per konten = snapshot terbaru dalam periode yang dipilih.
// - Grafik = jumlah views dari semua snapshot yang dicatat pada tanggal yang sama.
export function buildAnalytics(contents, period, today = new Date()) {
  const start = period === "all" ? null : format(subDays(today, Number(period)), "yyyy-MM-dd")
  const rows = []
  const viewsByDate = {}

  for (const content of contents) {
    const inRange = (content.metrics ?? []).filter((m) => !start || m.recorded_at >= start)
    if (inRange.length === 0) continue
    const latest = inRange[0]
    rows.push({
      id: content.id,
      title: content.title,
      platform: content.channel?.platform,
      views: latest.views_count ?? 0,
      likes: latest.likes_count ?? 0,
      comments: latest.comments_count ?? 0,
      shares: latest.shares_count ?? 0,
    })
    for (const m of inRange) {
      viewsByDate[m.recorded_at] = (viewsByDate[m.recorded_at] ?? 0) + (m.views_count ?? 0)
    }
  }

  const sum = (key) => rows.reduce((total, row) => total + row[key], 0)

  const series = Object.entries(viewsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, value]) => ({ key: date, label: formatDate(date), value }))

  const byPlatform = {}
  for (const row of rows) byPlatform[row.platform] = (byPlatform[row.platform] ?? 0) + row.views
  const platforms = Object.entries(byPlatform)
    .map(([platform, value]) => ({ platform, value }))
    .sort((a, b) => b.value - a.value)

  return {
    hasData: rows.length > 0,
    totals: { views: sum("views"), likes: sum("likes"), comments: sum("comments"), shares: sum("shares") },
    series,
    platforms,
    top: [...rows].sort((a, b) => b.views - a.views).slice(0, 5),
  }
}
