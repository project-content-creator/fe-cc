import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FeedbackDialog from "@/components/common/FeedbackDialog"
import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applyServerErrors } from "@/lib/formErrors"
import { brandBtn, cardClass, inputClass } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { changePassword } from "@/services/account.service"

const passwordSchema = z.object({
  current_password: z.string().min(1, "Password saat ini wajib diisi"),
  password: z.string().min(8, "Minimal 8 karakter"),
})

export default function PasswordCard() {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { current_password: "", password: "" } })

  const onSubmit = async (values) => {
    try {
      await changePassword(values)
      reset()
      setDone(true)
    } catch (err) {
      const status = err.response?.status
      if (status === 401 || status === 403) {
        setError("current_password", { type: "server", message: "Password saat ini salah" })
      } else {
        applyServerErrors(err, setError, "Gagal mengganti password. Coba lagi.")
      }
    }
  }

  return (
    <section aria-labelledby="password-title" className={cn(cardClass, "p-6")}>
      <h2 id="password-title" className="mb-4 text-lg font-extrabold text-ink">Ganti password</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root?.server && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {errors.root.server.message}
          </p>
        )}

        <FormField id="current_password" label="Password saat ini" error={errors.current_password?.message}>
          <Input
            id="current_password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            aria-invalid={!!errors.current_password}
            aria-describedby={errors.current_password ? "current_password-error" : undefined}
            {...register("current_password")}
          />
        </FormField>

        <FormField id="new_password" label="Password baru" error={errors.password?.message}>
          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "new_password-error" : undefined}
            {...register("password")}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Memproses..." : "Perbarui password"}
        </Button>
      </form>

      <FeedbackDialog
        open={done}
        onOpenChange={setDone}
        title="Password berhasil diganti"
        description="Gunakan password baru kamu saat login berikutnya."
      />
    </section>
  )
}
