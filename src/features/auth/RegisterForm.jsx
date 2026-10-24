import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/services/auth.service"

// Validasi sisi klien hanya untuk UX. Validasi utama tetap di server.
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(191, "Email maksimal 191 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
})

const inputClass =
  "h-12 rounded-xl border-line bg-card px-4 text-base text-ink focus-visible:border-brand-violet focus-visible:ring-brand-violet/30"

function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values) => {
    try {
      await registerUser(values)
      navigate("/login", { replace: true, state: { registered: true } })
    } catch (err) {
      const response = err.response

      // Asumsi kontrak error: 422 { errors: { email: ["Email already taken"] } }
      if (response?.status === 422 && response.data?.errors) {
        Object.entries(response.data.errors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
        return
      }

      setError("root.server", {
        type: "server",
        message: "Pendaftaran gagal. Periksa koneksi internet lalu coba lagi.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.server && (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          {errors.root.server.message}
        </p>
      )}

      <Field id="name" label="Nama lengkap" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-gradient h-12 w-full rounded-xl text-base font-bold text-white hover:opacity-90"
      >
        {isSubmitting ? "Memproses..." : "Buat akun"}
      </Button>

      <p className="text-center text-sm text-muted-ink">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-bold text-link underline">
          Masuk
        </Link>
      </p>
    </form>
  )
}
