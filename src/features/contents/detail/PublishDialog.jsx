import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { isHttpUrl } from "@/features/contents/contentForm.js"
import { applyServerErrors } from "@/lib/formErrors.js"
import { brandBtn, inputClass, outlineBtn } from "@/lib/styles.js"
import { updateContent } from "@/services/content.service.js"

const publishSchema = z.object({
  published_url: z
    .string()
    .trim()
    .min(1, "Published URL wajib diisi")
    .refine(isHttpUrl, "URL tidak valid (awali dengan https://)"),
  published_date: z.string().min(1, "Tanggal tayang wajib diisi"),
})

function PublishForm({ content, onClose, onPublished }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      published_url: content.published_url ?? "",
      published_date: content.published_date ?? format(new Date(), "yyyy-MM-dd"),
    },
  })

  const onSubmit = async (values) => {
    try {
      await updateContent(content.id, { status: "published", ...values })
      toast.success("Konten berhasil dipublikasikan")
      onPublished()
    } catch (err) {
      applyServerErrors(err, setError, "Gagal mempublikasikan konten. Coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.server && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}

      <FormField
        id="publish_url"
        label="Published URL *"
        hint="Link YouTube, TikTok, atau Instagram akan tampil sebagai video yang bisa diputar di halaman detail."
        error={errors.published_url?.message}
      >
        <Input
          id="publish_url"
          type="url"
          inputMode="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
          aria-invalid={!!errors.published_url}
          aria-describedby={errors.published_url ? "publish_url-error" : undefined}
          {...register("published_url")}
        />
      </FormField>

      <FormField id="publish_date" label="Tanggal tayang *" error={errors.published_date?.message}>
        <Input id="publish_date" type="date" className={inputClass} {...register("published_date")} />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className={outlineBtn}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Memublikasikan..." : "Publish sekarang"}
        </Button>
      </div>
    </form>
  )
}

// Hanya dipakai admin: mengisi Published URL lalu memindahkan konten Ready -> Published.
export default function PublishDialog({ open, onOpenChange, content, onPublished }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-7 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-ink">Publikasikan konten</DialogTitle>
          <DialogDescription className="text-sm text-muted-ink">
            Isi link postingan yang sudah tayang untuk <b className="text-ink">{content.title}</b>.
          </DialogDescription>
        </DialogHeader>
        {open && <PublishForm content={content} onClose={() => onOpenChange(false)} onPublished={onPublished} />}
      </DialogContent>
    </Dialog>
  )
}
