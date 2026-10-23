import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import ChipGroup from "@/components/common/ChipGroup"
import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PLATFORM_OPTIONS } from "@/constant/platforms"
import { channelDefaults, channelSchema } from "@/features/channels/channelSchema"
import { applyServerErrors } from "@/lib/formErrors"
import { brandBtn, inputClass, outlineBtn } from "@/lib/styles"
import { cn } from "@/lib/utils"

// Dipakai untuk form "Tambah channel" (di halaman) dan pop-up "Edit channel".
export default function ChannelForm({
  idPrefix,
  initialValues = channelDefaults,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(channelSchema), defaultValues: initialValues })

  const submit = async (values) => {
    try {
      await onSubmit({ platform: values.platform, handle_name: values.handle_name })
      if (resetOnSuccess) reset(channelDefaults)
    } catch (err) {
      applyServerErrors(err, setError, "Gagal menyimpan channel. Coba lagi.")
    }
  }

  const handleId = `${idPrefix}-handle`

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      {errors.root?.server && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}

      <FormField label="Platform *" error={errors.platform?.message}>
        <Controller
          name="platform"
          control={control}
          render={({ field }) => (
            <ChipGroup label="Platform" options={PLATFORM_OPTIONS} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField id={handleId} label="Handle *" error={errors.handle_name?.message}>
        <Input
          id={handleId}
          placeholder="@namaakun"
          autoComplete="off"
          className={inputClass}
          aria-invalid={!!errors.handle_name}
          aria-describedby={errors.handle_name ? `${handleId}-error` : undefined}
          {...register("handle_name")}
        />
      </FormField>

      <div className={cn("flex gap-2", onCancel ? "justify-end" : "")}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className={outlineBtn}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className={cn(brandBtn, !onCancel && "w-full")}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
