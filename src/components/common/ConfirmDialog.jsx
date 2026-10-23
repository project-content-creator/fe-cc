import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { outlineBtn } from "@/lib/styles"

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ya, hapus",
  loading = false,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-3xl p-7">
        <AlertDialogHeader className="text-left">
          <div className="mb-2 flex size-13 items-center justify-center rounded-full bg-red-100 text-danger">
            <Trash2 className="size-6" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold text-ink">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-ink">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className={outlineBtn}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault() // untuk tahan dialog tetap terbuka sampai proses selesai
              onConfirm()
            }}
            className="h-11 rounded-xl bg-danger px-5 text-sm font-bold text-white hover:bg-danger/90"
          >
            {loading ? "Menghapus..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
