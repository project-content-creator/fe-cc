import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import ConfirmDialog from "@/components/common/ConfirmDialog"
import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PlatformBadge from "@/components/common/PlatformBadge"
import StatusBadge from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FORMAT_MAP } from "@/constant/formats"
import { PRIORITY_MAP } from "@/constant/priorities"
import { STATUSES } from "@/constant/status"
import ContentEditDialog from "@/features/contents/ContentEditDialog"
import ChecklistSection from "@/features/contents/detail/ChecklistSection"
import MetricsSection from "@/features/contents/detail/MetricsSection"
import PublishCard from "@/features/contents/detail/PublishCard"
import StatusStepper from "@/features/contents/detail/StatusStepper"
import { useChannels } from "@/hooks/useChannels"
import { useContent } from "@/hooks/useContent"
import { formatDateLong } from "@/lib/format"
import { cardClass, filterTriggerClass, outlineBtn } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { deleteContent, updateContent } from "@/services/content.service"

export default function ContentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: content, loading, error, reload } = useContent(id)
  const { data: channels } = useChannels()

  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)

  if (loading && !content) return <LoadingBlock className="h-96" />
  if (error?.response?.status === 404) {
    return (
      <EmptyState title="Konten tidak ditemukan" description="Konten ini mungkin sudah dihapus.">
        <Link to="/content" className="font-bold text-link underline">Kembali ke Content List</Link>
      </EmptyState>
    )
  }
  if (error || !content) return <ErrorState onRetry={reload} />

  const checklists = content.checklists ?? []
  const metrics = content.metrics ?? []

  const handleStatusChange = async (value) => {
    if (value === content.status) return
    // Published butuh URL, jadi arahkan ke form edit dengan status sudah terpilih.
    if (value === "published" && !content.published_url) {
      setEditing({ ...content, status: "published" })
      return
    }
    setStatusSaving(true)
    try {
      await updateContent(content.id, { status: value })
      toast.success("Status berhasil diperbarui")
      reload()
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.status?.[0] ?? err.response?.data?.message ?? "Gagal mengubah status."
      )
    } finally {
      setStatusSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteContent(content.id)
      toast.success("Konten berhasil dihapus")
      navigate("/content", { replace: true })
    } catch {
      toast.error("Gagal menghapus konten. Coba lagi.")
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted-ink">
        <Link to="/content" className="hover:underline">Content</Link> / Detail
      </nav>

      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold break-words text-ink lg:text-3xl">{content.title}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-muted-ink">
            <StatusBadge status={content.status} />
            <span className="rounded-full bg-surface-deep px-3 py-1 text-xs font-bold text-ink">
              Prioritas {PRIORITY_MAP[content.priority]?.label.toLowerCase()}
            </span>
            <PlatformBadge platform={content.channel?.platform} />
            <span>{content.channel?.handle_name} · {FORMAT_MAP[content.format_type]?.label}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={content.status} onValueChange={handleStatusChange} disabled={statusSaving}>
            <SelectTrigger aria-label="Ubah status" className={filterTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setEditing(content)} className={outlineBtn}>Edit</Button>
          <Button
            variant="outline"
            onClick={() => setDeleting(true)}
            className={cn(outlineBtn, "text-danger hover:text-danger")}
          >
            Hapus
          </Button>
        </div>
      </header>

      <StatusStepper status={content.status} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <section className={cn(cardClass, "p-6")}>
            <h2 className="mb-1 text-base font-extrabold text-ink">Konsep</h2>
            <p className="mb-4 text-sm whitespace-pre-line text-muted-ink">
              {content.description || "Belum ada deskripsi."}
            </p>
            <h2 className="mb-1 text-base font-extrabold text-ink">Script draft</h2>
            <p className="mb-4 text-sm whitespace-pre-line text-muted-ink">
              {content.script_draft || "Belum ada script."}
            </p>
            <p className="text-xs text-muted-ink">
              Jadwal: {formatDateLong(content.scheduled_date)} · Tayang: {formatDateLong(content.published_date)}
            </p>
          </section>
          <ChecklistSection key={content.id} contentId={content.id} initialItems={checklists} />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <PublishCard content={content} />
          <MetricsSection
            key={`${content.id}-${content.status === "published"}`}
            contentId={content.id}
            isPublished={content.status === "published"}
            initialMetrics={metrics}
          />
        </div>
      </div>

      <ContentEditDialog
        content={editing}
        channels={channels}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          reload()
        }}
      />

      <ConfirmDialog
        open={deleting}
        onOpenChange={(open) => !open && !deleteLoading && setDeleting(false)}
        title="Hapus konten ini?"
        description={
          <>
            Konten <b className="text-ink">{content.title}</b> akan dihapus permanen beserta {checklists.length} item
            checklist dan {metrics.length} log metrik. Tindakan ini tidak bisa dibatalkan.
          </>
        }
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </>
  )
}
