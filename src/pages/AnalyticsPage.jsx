import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import BarChart from "@/components/common/BarChart"
import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PageHeader from "@/components/common/PageHeader"
import PlatformBadge from "@/components/common/PlatformBadge"
import StatCard from "@/components/common/StatCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLATFORMS } from "@/constants/platforms"
import { buildAnalytics, PERIODS } from "@/features/analytics/analyticsUtils"
import { usePublishedMetrics } from "@/hooks/usePublishedMetrics"
import { formatCompact } from "@/lib/format"
import { cardClass, filterTriggerClass } from "@/lib/styles"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30")
  const { data: contents, loading, error, reload } = usePublishedMetrics()
  const analytics = useMemo(() => buildAnalytics(contents, period), [contents, period])
  const { totals } = analytics
  const platformTotal = analytics.platforms.reduce((sum, item) => sum + item.value, 0) || 1

  return (
    <>
      <PageHeader title="Analytics" subtitle="Performa konten yang sudah published">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger aria-label="Periode" className={filterTriggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <div className="space-y-4">
          <LoadingBlock className="h-32" />
          <LoadingBlock className="h-72" />
        </div>
      ) : !analytics.hasData ? (
        <EmptyState
          title="Belum ada data performa"
          description="Catat metrik pada konten yang sudah published, atau pilih periode yang lebih panjang."
        />
      ) : (
        <>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Views" value={formatCompact(totals.views)} note="dari semua konten" />
            <StatCard label="Likes" value={formatCompact(totals.likes)} note="total suka" />
            <StatCard label="Komentar" value={formatCompact(totals.comments)} note="total komentar" />
            <StatCard label="Shares" value={formatCompact(totals.shares)} note="total bagikan" />
          </div>

          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <section aria-labelledby="chart-title" className={cn(cardClass, "p-6")}>
              <h2 id="chart-title" className="mb-4 text-lg font-extrabold text-ink">Views dari waktu ke waktu</h2>
              <BarChart data={analytics.series} ariaLabel="Grafik views per tanggal pencatatan" />
            </section>

            <section aria-labelledby="platform-title" className={cn(cardClass, "p-6")}>
              <h2 id="platform-title" className="mb-4 text-lg font-extrabold text-ink">Views per platform</h2>
              <ul className="space-y-4">
                {analytics.platforms.map((item) => {
                  const percent = Math.max(Math.round((item.value / platformTotal) * 100), 3)
                  const label = PLATFORMS[item.platform]?.label ?? "Lainnya"
                  return (
                    <li key={item.platform}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-bold text-ink">{label}</span>
                        <span className="text-muted-ink">{formatCompact(item.value)}</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Porsi views ${label}`}
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-2.5 rounded-full bg-surface-deep"
                      >
                        <div className="bg-brand-gradient h-full rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>

          <section aria-labelledby="top-title" className={cn(cardClass, "overflow-x-auto p-6")}>
            <h2 id="top-title" className="mb-3 text-lg font-extrabold text-ink">Konten terbaik</h2>
            <table className="w-full border-collapse text-sm text-ink" style={{ minWidth: "560px" }}>
              <thead>
                <tr className="text-left text-muted-ink">
                  <th scope="col" className="pb-3 font-medium">Judul</th>
                  <th scope="col" className="pb-3 font-medium">Platform</th>
                  <th scope="col" className="pb-3 text-right font-medium">Views</th>
                  <th scope="col" className="pb-3 text-right font-medium">Likes</th>
                  <th scope="col" className="pb-3 text-right font-medium">Shares</th>
                </tr>
              </thead>
              <tbody>
                {analytics.top.map((row) => (
                  <tr key={row.id} className="border-t border-surface-deep">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      <Link to={`/content/${row.id}`} className="hover:underline">{row.title}</Link>
                    </th>
                    <td className="py-3 pr-4"><PlatformBadge platform={row.platform} /></td>
                    <td className="py-3 text-right">{formatCompact(row.views)}</td>
                    <td className="py-3 text-right">{formatCompact(row.likes)}</td>
                    <td className="py-3 text-right">{formatCompact(row.shares)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </>
  )
}
