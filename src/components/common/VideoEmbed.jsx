import { getEmbed } from "@/lib/embed.js"

export default function VideoEmbed({ url, title = "Video konten" }) {
  const embed = getEmbed(url)

  if (!embed) {
    return (
      <p className="rounded-xl bg-surface-deep px-4 py-3 text-xs text-muted-ink">
        Pratinjau video tidak tersedia untuk link ini. Gunakan link di atas untuk menontonnya.
      </p>
    )
  }

  if (embed.type === "video") {
    return <video src={embed.src} controls preload="metadata" className="w-full rounded-2xl bg-black" />
  }

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-2xl bg-black"
      style={{ maxWidth: embed.maxWidth, aspectRatio: embed.height ? undefined : embed.aspect, height: embed.height }}
    >
      <iframe
        src={embed.src}
        title={`${title} (${embed.provider})`}
        className="size-full border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  )
}
