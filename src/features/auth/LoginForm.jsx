import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { inputClass } from "@/lib/styles"
import { loginUser } from "@/services/auth.service"

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } })

  // Pesan sukses setelah mendaftar (dikirim dari RegisterForm lewat state router)
  useEffect(() => {
    if (location.state?.registered) toast.success("Akun berhasil dibuat. Silakan masuk.")
  }, [location.state])

  const onSubmit = async (values) => {
    try {
      const data = await loginUser(values)
      login(data)
      navigate(location.state?.from?.pathname ?? "/", { replace: true })
    } catch (err) {
      const status = err.response?.status
      if (status === 401 || status === 422) {
        setError("password", { type: "server", message: "Email atau password salah" })
      } else {
        setError("root.server", {
          type: "server",
          message: "Gagal masuk. Periksa koneksi internet lalu coba lagi.",
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.server && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-gradient h-12 w-full rounded-xl text-base font-bold text-white hover:opacity-90"
      >
        {isSubmitting ? "Memproses..." : "Masuk"}
      </Button>

      <p className="text-center text-sm text-muted-ink">
        Belum punya akun?{" "}
        <Link to="/register" className="font-bold text-link underline">
          Daftar
        </Link>
      </p>
    </form>
  )
}
