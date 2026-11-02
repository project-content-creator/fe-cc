import { Button } from "@/components/ui/button"
import { PLATFORMS } from "@/constant/platforms.js"
import { cardClass, outlineBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"

const small = "h-10 px-4"

// `canManage`: tombol Edit/Hapus hanya untuk admin atau pemilik channel (creator).
export default function ChannelCard({ channel, contentCount, canManage, onEdit, onDelete }) {
  const platform = PLATFORMS[channel.platform]

  return (
    <article className={cn(cardClass, "p-5")}>
      <div className="flex items-center gap-3">
        <span className="flex size-12 flex-none items-center justify-center rounded-xl bg-chip text-sm font-extrabold text-chip-ink">
          {platform?.code}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-bold text-ink">{channel.handle_name}</h2>
          <p className="text-xs text-muted-ink">
            {platform?.label}
            {channel.owner_name && ` · oleh ${channel.owner_name}`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#dce6ff] px-3 py-1 text-xs font-bold text-[#1b3a9e]">
          {contentCount} konten
        </span>
        {canManage && (
          <div className="flex gap-1.5">
            <Button variant="outline" onClick={() => onEdit(channel)} className={cn(outlineBtn, small)}>
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(channel)}
              className={cn(outlineBtn, small, "text-danger hover:text-danger")}
            >
              Hapus
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}
