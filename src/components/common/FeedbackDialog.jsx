import { Check } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { brandBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

export default function FeedbackDialog({ open, onOpenChange, title, description, icon: Icon = Check }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-3xl p-7">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-1 flex size-13 items-center justify-center rounded-full bg-[#d3f5ea] text-[#0b6b4e]">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold text-ink">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-ink">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction className={cn(brandBtn, "w-full")}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
