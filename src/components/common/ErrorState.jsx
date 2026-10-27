import { Button } from "@/components/ui/button"
import { brandBtn, cardClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

export default function ErrorState({ onRetry }) {
  return (
    <div role="alert" className={cn(cardClass, "p-8 text-center")}>
      <p className="font-bold text-ink">Data gagal dimuat</p>
      <p className="mt-1 text-sm text-muted-ink">Periksa koneksi internet lalu coba lagi.</p>
      <Button onClick={onRetry} className={cn(brandBtn, "mt-4")}>
        Coba lagi
      </Button>
    </div>
  )
}
