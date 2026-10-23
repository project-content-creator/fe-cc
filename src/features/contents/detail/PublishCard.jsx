import { ExternalLink } from "lucide-react"
import { isHttpUrl } from "@/features/contents/contentForm"
import { formatDateLong } from "@/lib/format"
import { cardClass } from "@/lib/styles"
import { cn } from "@/lib/utils"

export default function PublishCard({ content }) {
  const published = content.status === "published"
  const url = content.published_url

  return (
    <section aria-labelledby="publish-title" className={cn(cardClass, "p-6")}>
      <h2 id="publish-title" className="mb-3 text-lg font-extrabold text-ink">Publikasi</h2>

      {published && url ? (
        <>
          {isHttpUrl(url) ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-2 text-sm font-bold break-all text-link underline"
            >
              {url}
              <ExternalLink className="size-4 flex-none" aria-hidden="true" />
              <span className="sr-only">(buka di tab baru)</span>
            </a>
          ) : (
            <p className="text-sm break-all text-ink">{url}</p>
          )}
          <p className="mt-2 text-xs text-muted-ink">Tayang: {formatDateLong(content.published_date)}</p>
        </>
      ) : published ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          Konten berstatus Published tetapi belum memiliki URL. Isi lewat tombol Edit.
        </p>
      ) : (
        <p className="text-sm text-muted-ink">
          Published URL wajib diisi saat status konten diubah ke Published.
        </p>
      )}
    </section>
  )
}
