import { Link } from "react-router-dom"  
import {
  BarChart3,
  CheckSquare,
  FileText,
  LayoutGrid,
  Layers,
  PlayCircle,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth.js"
import logoLockup from "@/assets/logo-lockup.png"

const features = [
  {
    icon: LayoutGrid,
    title: "Dashboard Terpusat",
    description:
      "Lihat ringkasan semua konten: yang sedang diproduksi, terjadwal minggu ini, dan yang butuh perhatian—dalam satu tampilan.",
  },
  {
    icon: Layers,
    title: "Pipeline Kanban",
    description:
      "Kelola alur produksi dari ide → scripting → recording → editing → ready → published dengan drag & drop yang intuitif.",
  },
  {
    icon: FileText,
    title: "Manajemen Konten",
    description:
      "Catat judul, format, platform, naskah, checklist produksi, dan jadwal tayang untuk setiap konten.",
  },
  {
    icon: BarChart3,
    title: "Analytics Performa",
    description:
      "Pantau views, likes, komentar, dan shares. Bandingkan performa antar platform dan temukan konten terbaikmu.",
  },
  {
    icon: Users,
    title: "Multi Channel",
    description:
      "Dukung banyak channel dan platform sekaligus: YouTube, TikTok, Instagram, LinkedIn—semua dari satu akun.",
  },
  {
    icon: CheckSquare,
    title: "Checklist Produksi",
    description:
      "Pastikan tidak ada langkah produksi yang terlewat dengan checklist yang bisa dikustomisasi per konten.",
  },
]

const statItems = [
  { icon: PlayCircle, value: "6 Status", label: "Alur produksi lengkap" },
  { icon: TrendingUp, value: "Real-time", label: "Metrik performa" },
  { icon: Zap, value: "Kanban", label: "Visual pipeline" },
  { icon: Users, value: "4 Platform", label: "YT, TT, IG, LI" },
]
const steps = [
  {
    step: "01",
    title: "Daftarkan Konten",
    description: "Tambahkan ide konten baru dengan judul, platform, format, dan jadwal tayang.",
  },
  {
    step: "02",
    title: "Ikuti Pipeline",
    description: "Geser status konten dari Idea ke Published seiring progres produksi.",
  },
  {
    step: "03",
    title: "Catat Performa",
    description: "Setelah publish, catat views dan metrik lainnya untuk analisis performa.",
  },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="min-h-svh bg-[#0f1328] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1328]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <img src={logoLockup} alt="CreatorTrack" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/"
                className="rounded-xl bg-linear-to-r from-indigo-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-linear-to-r from-indigo-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 text-center lg:py-36">
        {/* Gradient blobs */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 h-96 w-96 rounded-full bg-blue-950/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-950/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#b9b6ff]">
            Content Creator Tracker
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight lg:text-6xl">
            Dari ide ke publish,{" "}
            <span className="bg-linear-to-r from-indigo-300 to-indigo-600 bg-clip-text text-transparent">
              semua terlacak.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/70">
            Kelola naskah, produksi, jadwal tayang, dan metrik performa kontenmu di satu tempat.
            Tidak ada lagi konten yang terlupakan atau deadline yang terlewat.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to={isAuthenticated ? "/" : "/register"}
              className="w-full rounded-xl bg-linear-to-r from-indigo-400 to-blue-500 px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              {isAuthenticated ? "Buka Dashboard →" : "Mulai Gratis →"}
            </Link>
            <Link
              to="/login"
              className="w-full rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white sm:w-auto"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      </section>
      {/* Stats row */}
      <section className="border-y border-white/10 bg-white/5 px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {statItems.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/10">
                <Icon className="size-5 text-[#b9b6ff]" />
              </div>
              <p className="text-xl font-extrabold text-white">{value}</p>
              <p className="text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold">Semua yang kamu butuhkan</h2>
            <p className="text-white/60">
              Satu platform untuk seluruh siklus produksi konten kamu.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-b-blue-500/50 hover:bg-white/8"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-linear-to-r from-indi/30 to-blue-950/30">
                  <Icon className="size-5 text-[#b9b6ff]" />
                </div>
                <h3 className="mb-2 font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold">Cara kerjanya sederhana</h2>
            <p className="text-white/60">Mulai tracking kontenmu dalam 3 langkah.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-400 to-blue-500 text-xl font-extrabold">
                  {step}
                </div>
                <h3 className="mb-2 font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-3xl font-extrabold">
            Siap tingkatkan produktivitasmu?
          </h2>
          <p className="mb-8 text-white/60">
            Gabung dan mulai lacak kontenmu sekarang. Gratis tanpa kartu kredit.
          </p>
          <Link
            to={isAuthenticated ? "/" : "/register"}
            className="inline-block rounded-xl bg-linear-to-r from-indigo-400 to-blue-500 px-10 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
          >
            {isAuthenticated ? "Buka Dashboard →" : "Daftar Sekarang →"}
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} CreatorTrack. Dibuat untuk content creator yang serius.</p>
      </footer>
    </div>
  )
}