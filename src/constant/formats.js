export const FORMATS = [
  { value: "short_video", label: "Short Video" },
  { value: "long_video", label: "Long Video" },
  { value: "carousel", label: "Carousel" },
  { value: "single_post", label: "Single Post" },
]
export const FORMAT_VALUES = FORMATS.map((f) => f.value)
export const FORMAT_MAP = Object.fromEntries(FORMATS.map((f) => [f.value, f]))
