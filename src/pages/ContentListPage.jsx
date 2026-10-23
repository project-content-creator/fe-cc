import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import ConfirmDialog from "@/components/common/ConfirmDialog"
import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PageHeader from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import ContentEditDialog from "@/features/contents/ContentEditDialog"
import ContentFilters from "@/features/contents/ContentFilters"
import ContentTable from "@/features/contents/ContentTable"
import { useContentFilters } from "@/features/contents/useContentFilters"
import { useChannels } from "@/hooks/useChannels"
import { useContents } from "@/hooks/useContents"
import { brandBtn } from "@/lib/styles"
import { deleteContent } from "@/services/content.service"

function deleteDescription(content) {
  const parts = [
    content.checklist_total != null && `${content.checklist_total} item checklist`,
    content.metrics_count != null && `${content.metrics_count} log metrik`,
  ].filter(Boolean)
  return (
    <>
      Konten <b className="text-ink">{content.title}</b> akan dihapus permanen
      {parts.length > 0 && ` beserta ${parts.join(" dan ")}`}. Tindakan ini tidak bisa dibatalkan.
    </>
  )
}

export default function ContentListPage() {
  const { filters, setFilter, params } = useContentFilters()
  const { data: channels } = useChannels()
  const { data: contents, loading, error, reload } = useContents(params)

  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteContent(deleting.id)
      toast.success("Konten berhasil dihapus")
      setDeleting(null)
      reload()
    } catch {
      toast.error("Gagal menghapus konten. Coba lagi.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const hasFilter = Object.keys(params).length > 0

  return (
    <>
      <PageHeader title="Content List" subtitle="Kelola semua ide dan konten kamu">
        <Button asChild className={brandBtn}><Link to="/content/new">+ Buat konten</Link></Button>
      </PageHeader>

      <ContentFilters filters={filters} setFilter={setFilter} channels={channels} />

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <LoadingBlock className="h-96" />
      ) : contents.length === 0 ? (
        <EmptyState
          title={hasFilter ? "Tidak ada konten yang cocok" : "Belum ada konten"}
          description={hasFilter ? "Coba ubah atau hapus filter." : "Mulai dengan menambahkan ide pertamamu."}
        />
      ) : (
        <ContentTable contents={contents} onEdit={setEditing} onDelete={setDeleting} />
      )}

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
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !deleteLoading && setDeleting(null)}
        title="Hapus konten ini?"
        description={deleting && deleteDescription(deleting)}
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </>
  )
}
