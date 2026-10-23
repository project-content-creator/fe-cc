export const PLATFORMS = {
  youtube: { label: "YouTube", code: "YT" },
  tiktok: { label: "TikTok", code: "TT" },
  instagram: { label: "Instagram", code: "IG" },
  linkedin: { label: "LinkedIn", code: "IN" },
}

export const PLATFORM_OPTIONS = Object.entries(PLATFORMS).map(([value, { label }]) => ({ value, label }))