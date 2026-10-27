import { formatCompact } from "@/lib/format.js"

export default function BarChart({ data, ariaLabel }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div role="img" aria-label={ariaLabel} className="flex h-52 items-stretch gap-3">
      {data.map((item) => (
        <div key={item.key} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end" title={`${item.label}: ${formatCompact(item.value)}`}>
            <div
              className="bg-brand-gradient w-full rounded-t-lg"
              style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-xs text-muted-ink">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
