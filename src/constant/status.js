// Urutan sesuai lifecycle konten: idea -> scripting -> recording -> editing -> ready -> published
export const STATUSES = [
  { value: "idea", label: "Idea", className: "bg-[#e8eaf3] text-[#3a4262]" },
  { value: "scripting", label: "Scripting", className: "bg-[#dce6ff] text-[#1b3a9e]" },
  { value: "recording", label: "Recording", className: "bg-[#ffe9d2] text-[#8a3b00]" },
  { value: "editing", label: "Editing", className: "bg-[#ebdeff] text-[#5b22b8]" },
  { value: "ready", label: "Ready", className: "bg-[#d3f5ea] text-[#0b6b4e]" },
  { value: "published", label: "Published", className: "bg-[#0f1b4c] text-white ring-1 ring-white/15" },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]))
