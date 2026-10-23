import { cn } from "@/lib/utils"

export default function ChipGroup({ value, onChange, options, label }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-brand-violet/30 focus-visible:outline-none",
              selected
                ? "border-brand-violet bg-violet-soft text-violet-ink"
                : "border-line bg-white text-ink hover:bg-surface"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
