import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ContentFormFields from "@/features/contents/ContentFormFields"
import { contentSchema, toFormValues, toPayload } from "@/features/contents/contentForm.js"
import { applyServerErrors } from "@/lib/formErrors.js"
import { brandBtn, outlineBtn } from "@/lib/styles.js"
import { updateContent } from "@/services/content.service.js"

function EditForm({ content, channels, onClose, onSaved }) {
  const form = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: toFormValues(content),
  })
  const { handleSubmit, setError, formState: { errors, isSubmitting } } = form

  const onSubmit = async (values) => {
    try {
      await updateContent(content.id, toPayload(values))
      toast.success("Perubahan berhasil disimpan")
      onSaved()
    } catch (err) {
      applyServerErrors(err, setError, "Gagal menyimpan perubahan. Coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {errors.root?.server && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}
      <ContentFormFields mode="edit" form={form} channels={channels} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} className={outlineBtn}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
        </Button>
      </div>
    </form>
  )
}

export default function ContentEditDialog({ content, channels, onClose, onSaved }) {
  return (
    <Dialog open={Boolean(content)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92svh] max-w-3xl overflow-y-auto rounded-3xl p-8 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-ink">Edit Konten</DialogTitle>
          <DialogDescription className="sr-only">Ubah data konten lalu simpan perubahan</DialogDescription>
        </DialogHeader>
        {content && (
          <EditForm key={content.id} content={content} channels={channels} onClose={onClose} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  )
}
