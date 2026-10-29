import ModeToggle from "@/components/common/ModeToggle"
import { cardClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

export default function ThemeCard() {
  return (
    <section aria-labelledby="theme-title" className={cn(cardClass, "flex items-center justify-between gap-4 p-6")}>
      <div>
        <h2 id="theme-title" className="text-lg font-extrabold text-ink">Tema</h2>
        <p className="text-sm text-muted-ink">Pilih Tampilan Aplikasi</p>
      </div>
      <ModeToggle />
    </section>
  )
}
