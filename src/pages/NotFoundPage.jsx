import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-surface p-6 text-center">
      <h1 className="text-3xl font-extrabold text-ink">Halaman tidak ditemukan</h1>
      <p className="text-muted-ink">Alamat yang kamu buka tidak ada atau sudah dipindahkan.</p>
      <Link to="/" className="font-bold text-link underline">Kembali ke Dashboard</Link>
    </div>
  )
}
