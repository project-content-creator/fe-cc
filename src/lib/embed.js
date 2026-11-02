// Mengubah link video (YouTube, TikTok, Instagram, atau file video langsung) menjadi data pemutar.
// Hanya host yang dikenal yang diizinkan; link lain tidak di-embed (ditampilkan sebagai tautan biasa).

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"])
const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com"])
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"])
const VIDEO_FILE = /\.(mp4|webm|ogg)$/i

function parse(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed : null
  } catch {
    return null
  }
}

export function getEmbed(url) {
  const parsed = parse(url)
  if (!parsed) return null
  const host = parsed.hostname.toLowerCase()
  const parts = parsed.pathname.split("/").filter(Boolean)

  // YouTube: watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  if (host === "youtu.be" || YOUTUBE_HOSTS.has(host)) {
    let id = null
    if (host === "youtu.be") id = parts[0]
    else if (parts[0] === "watch") id = parsed.searchParams.get("v")
    else if (["shorts", "embed", "live", "v"].includes(parts[0])) id = parts[1]
    if (id && /^[\w-]{11}$/.test(id)) {
      const vertical = parts[0] === "shorts"
      return {
        type: "iframe",
        provider: "YouTube",
        src: `https://www.youtube-nocookie.com/embed/${id}`,
        aspect: vertical ? "9 / 16" : "16 / 9",
        maxWidth: vertical ? 340 : undefined,
      }
    }
    return null
  }

  // TikTok: tiktok.com/@akun/video/ID (link pendek vm.tiktok.com tidak bisa di-embed)
  if (TIKTOK_HOSTS.has(host)) {
    const at = parts.indexOf("video")
    const id = at >= 0 ? parts[at + 1] : null
    if (id && /^\d{8,25}$/.test(id)) {
      return { type: "iframe", provider: "TikTok", src: `https://www.tiktok.com/embed/v2/${id}`, aspect: "9 / 16", maxWidth: 340 }
    }
    return null
  }

  // Instagram: instagram.com/p/KODE, /reel/KODE, /tv/KODE
  if (INSTAGRAM_HOSTS.has(host)) {
    const kind = { p: "p", reel: "reel", reels: "reel", tv: "tv" }[parts[0]]
    const code = parts[1]
    if (kind && code && /^[\w-]{5,}$/.test(code)) {
      return { type: "iframe", provider: "Instagram", src: `https://www.instagram.com/${kind}/${code}/embed`, height: 640, maxWidth: 420 }
    }
    return null
  }

  // File video langsung (.mp4, .webm, .ogg)
  if (VIDEO_FILE.test(parsed.pathname)) {
    return { type: "video", provider: "Video", src: parsed.href }
  }

  return null
}
