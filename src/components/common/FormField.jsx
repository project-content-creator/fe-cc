import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Jika `id` tidak diberikan (mis. grup chip), label dirender sebagai teks biasa.
export default function FormField({ id, label, error, hint, className, children }) {
  const LabelTag = id ? Label : "span"
  return (
    <div className={cn("space-y-1.5", className)}>
      <LabelTag {...(id ? { htmlFor: id } : {})} className="block text-sm font-bold text-ink">
        {label}
      </LabelTag>
      {children}
      {hint && !error && <p className="text-xs text-muted-ink">{hint}</p>}
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
