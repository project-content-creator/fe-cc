import AuthLayout from "@/components/layout/AuthLayout"
import LoginForm from "@/features/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout
      headline="Selamat datang kembali."
      description="Lanjutkan alur produksi kontenmu dari ide sampai publish."
    >
      <LoginForm />
    </AuthLayout>
  )
}
