import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import PublishDialog from "@/features/contents/detail/PublishDialog"
import { useAuth } from "@/hooks/useAuth.js"
import { getStatusMoves, visibleStatuses } from "@/lib/permissions.js"
import { brandBtn, outlineBtn } from "@/lib/styles.js"
import { updateContent } from "@/services/content.service.js"

export default function StatusActions({ content, onChanged }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { next, prev, needsAdminToPublish } = getStatusMoves(user, content)
  const [saving, setSaving] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)

  const move = async (target) => {
    if (target.value === "published") {
      setPublishOpen(true) // wajib mengisi Published URL
      return
    }
    setSaving(true)
    try {
      await updateContent(content.id, { status: target.value })
      // Setelah status berpindah ke tahap yang tidak lagi terlihat oleh role ini (mis. creator -> Editing),
      // konten sudah di tangan role lain, jadi kembali ke daftar.
      if (!visibleStatuses(user?.role).includes(target.value)) {
        toast.success(`Konten dipindahkan ke ${target.label}`)
        navigate("/content", { replace: true })
        return
      }
      toast.success(`Status diubah ke ${target.label}`)
      onChanged()
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.status?.[0] ?? err.response?.data?.message ?? "Gagal mengubah status."
      )
    } finally {
      setSaving(false)
    }
  }

  if (!next && !prev && !needsAdminToPublish) return null

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        {prev && (
          <Button variant="outline" disabled={saving} onClick={() => move(prev)} className={outlineBtn}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke {prev.label}
          </Button>
        )}
        {next && (
          <Button disabled={saving} onClick={() => move(next)} className={brandBtn}>
            {next.value === "published" ? "Publish" : `Pindahkan ke ${next.label}`}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      {needsAdminToPublish && (
        <p className="text-xs text-muted-ink">Hanya admin yang dapat mempublikasikan konten ini.</p>
      )}

      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        content={content}
        onPublished={() => {
          setPublishOpen(false)
          onChanged()
        }}
      />
    </div>
  )
}
