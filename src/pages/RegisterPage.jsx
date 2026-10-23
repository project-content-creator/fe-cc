import AuthLayout from "@/components/layout/AuthLayout"
import RegisterForm from "@/features/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout
      headline="Dari ide ke publish, semua terlacak."
      description="Kelola naskah, produksi, jadwal tayang, dan metrik performa di satu tempat."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
