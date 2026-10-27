import { Link } from "react-router-dom"

import PlatformBadge from "@/components/common/PlatformBadge"
import { FORMAT_MAP } from "@/constant/formats.js"
import { PRIORITY_MAP } from "@/constant/priorities.js"
import { formatCompact, formatDate } from "@/lib/format.js"

function metaLine(content) {
  const parts = []
  if (content.status === "published") {
    if (content.latest_views != null) parts.push(`${formatCompact(content.latest_views)} views`)
  } else if (content.status === "idea" || content.status === "scripting") {
    parts.push(`Prioritas ${PRIORITY_MAP[content.priority]?.label.toLowerCase()}`)
  } else {
    parts.push(`Tayang ${formatDate(content.scheduled_date)}`)
  }
  if (content.checklist_total != null) {
    parts.push(`${content.checklist_done ?? 0}/${content.checklist_total}`)
  }
  return parts.join(" · ")
}

export default function KanbanCard({ content }) {
  return (
    <Link
      to={`/content/${content.id}`}
      className="block rounded-2xl bg-card p-3.5 shadow-[0_2px_10px_rgba(79,95,255,0.07)] transition-shadow hover:shadow-[0_4px_16px_rgba(79,95,255,0.18)] focus-visible:ring-3 focus-visible:ring-brand-violet/40 focus-visible:outline-none"
    >
      <h3 className="mb-2 text-sm leading-snug font-bold text-ink">{content.title}</h3>
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-ink">
        <PlatformBadge platform={content.channel?.platform} />
        {FORMAT_MAP[content.format_type]?.label}
      </div>
      <p className="text-xs text-muted-ink">{metaLine(content)}</p>
    </Link>
  )
}
