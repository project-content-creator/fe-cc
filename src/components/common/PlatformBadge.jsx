import { PLATFORMS } from "@/constant/platforms"

export default function PlatformBadge({ platform }) {
  const config = PLATFORMS[platform]
  if (!config) return null
  return (
    <span
      title={config.label}
      className="inline-block rounded-md bg-chip px-2 py-0.5 text-[11px] font-extrabold text-chip-ink"
    >
      {config.code}
    </span>
  )
}
