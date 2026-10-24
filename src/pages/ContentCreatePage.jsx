import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import PageHeader from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import ContentFormFields from "@/features/contents/ContentFormFields"
import { contentSchema, createDefaults, toPayload } from "@/features/contents/contentForm"
import { useChannels } from "@/hooks/useChannels"
import { applyServerErrors } from "@/lib/formErrors"
import { brandBtn, cardClass, outlineBtn } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { createContent } from "@/services/content.service"

export default function ContentCreatePage() {
  const navigate = useNavigate()
  const { data: channels } = useChannels()
  const form = useForm({ resolver: zodResolver(contentSchema), defaultValues: createDefaults })
  const { handleSubmit, setError, setValue, getValues, formState: { errors, isSubmitting } } = form

  // Pilih channel pertama sebagai default setelah daftar channel termuat.
  useEffect(() => {
    if (channels.length > 0 && !getValues("channel_id")) {
      setValue("channel_id", String(channels[0].id))
    }
  }, [channels, getValues, setValue])

  const onSubmit = async (values) => {
    try {
      await createContent(toPayload(values))
      toast.success("Ide berhasil disimpan")
      navigate("/content")
    } catch (err) {
      applyServerErrors(err, setError, "Gagal menyimpan konten. Coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="Buat Konten Baru" subtitle="Status awal otomatis: Idea">
        <Button asChild variant="outline" className={outlineBtn}><Link to="/content">Batal</Link></Button>
        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Menyimpan..." : "Simpan ide"}
        </Button>
      </PageHeader>

      {errors.root?.server && (
        <p role="alert" className="mb-4 max-w-4xl rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}

      <div className={cn(cardClass, "max-w-4xl p-6 sm:p-8")}>
        <ContentFormFields mode="create" form={form} channels={channels} />
      </div>
    </form>
  )
}
