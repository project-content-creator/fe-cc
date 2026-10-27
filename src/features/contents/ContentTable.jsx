import { Link } from "react-router-dom"

import PlatformBadge from "@/components/common/PlatformBadge"
import StatusBadge from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { FORMAT_MAP } from "@/constant/formats.js"
import { PRIORITY_MAP } from "@/constant/priorities.js"
import { formatDate } from "@/lib/format.js"
import { cardClass, outlineBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

const small = "h-10 px-4"

export default function ContentTable({ contents, onEdit, onDelete }) {
  return (
    <div className={cn(cardClass, "overflow-x-auto p-6")}>
      <table className="w-full min-w-1.5 border-collapse text-sm text-ink">
        <thead>
          <tr className="border-b border-surface-deep text-left text-muted-ink">
            <th scope="col" className="pb-3 font-medium">Judul</th>
            <th scope="col" className="pb-3 font-medium">Channel</th>
            <th scope="col" className="pb-3 font-medium">Format</th>
            <th scope="col" className="pb-3 font-medium">Status</th>
            <th scope="col" className="pb-3 font-medium">Prioritas</th>
            <th scope="col" className="pb-3 font-medium">Jadwal</th>
            <th scope="col" className="pb-3"><span className="sr-only">Aksi</span></th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.id} className="border-b border-surface-deep last:border-0">
              <th scope="row" className="py-3 pr-4 text-left font-bold">{content.title}</th>
              <td className="py-3 pr-4"><PlatformBadge platform={content.channel?.platform} /></td>
              <td className="py-3 pr-4">{FORMAT_MAP[content.format_type]?.label}</td>
              <td className="py-3 pr-4"><StatusBadge status={content.status} /></td>
              <td className="py-3 pr-4">{PRIORITY_MAP[content.priority]?.label}</td>
              <td className="py-3 pr-4">{formatDate(content.scheduled_date)}</td>
              <td className="py-3">
                <div className="flex gap-1.5">
                  <Button asChild variant="outline" className={cn(outlineBtn, small)}>
                    <Link to={`/content/${content.id}`}>Lihat</Link>
                  </Button>
                  <Button variant="outline" onClick={() => onEdit(content)} className={cn(outlineBtn, small)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDelete(content)}
                    className={cn(outlineBtn, small, "text-danger hover:text-danger")}
                  >
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted-ink">Menampilkan {contents.length} konten</p>
    </div>
  )
}
