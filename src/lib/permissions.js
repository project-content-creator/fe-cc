import { STATUSES } from "@/constant/status.js"

const ALL = STATUSES.map((status) => status.value)

// Status yang boleh DILIHAT tiap role.
const VISIBLE = {
  admin: ALL,
  creator: ["idea", "scripting", "recording"],
  editor: ["editing", "ready"],
}

// Status tujuan yang boleh DIPILIH. Creator boleh menyerahkan konten ke editor (-> editing);
// hanya admin yang boleh memilih "published".
const ASSIGNABLE = {
  admin: ALL,
  creator: ["idea", "scripting", "recording", "editing"],
  editor: ["editing", "ready"],
}

export const visibleStatuses = (role) => VISIBLE[role] ?? []
export const assignableStatuses = (role) => ASSIGNABLE[role] ?? []

export const isAdmin = (user) => user?.role === "admin"
export const canCreateContent = (user) => ["admin", "creator"].includes(user?.role)
export const canViewMetrics = (user) => isAdmin(user)
export const canViewAnalytics = (user) => isAdmin(user)
export const canManageUsers = (user) => isAdmin(user)
export const canCreateChannel = (user) => ["admin", "creator"].includes(user?.role)

// Mengubah isi konten & menghapus: admin, atau creator pemilik konten.
export const canEditContent = (user, content) =>
  isAdmin(user) || (user?.role === "creator" && Number(content.user_id) === Number(user.id))
export const canDeleteContent = canEditContent

// Channel: admin boleh semua, creator hanya miliknya, editor hanya melihat.
export const canManageChannel = (user, channel) =>
  isAdmin(user) || (user?.role === "creator" && Number(channel.user_id) === Number(user.id))

// Tombol pindah status: langkah maju/mundur satu tahap, hanya jika tahap tujuan boleh dipilih role ini.
export function getStatusMoves(user, content) {
  const index = ALL.indexOf(content.status)
  const allowed = assignableStatuses(user?.role)
  const canAct = visibleStatuses(user?.role).includes(content.status)
  const pick = (value) => (canAct && value && allowed.includes(value) ? STATUSES.find((s) => s.value === value) : null)
  return {
    next: pick(ALL[index + 1]),
    prev: pick(ALL[index - 1]),
    // Konten Ready, tapi role ini tidak boleh mempublikasikannya.
    needsAdminToPublish: content.status === "ready" && !allowed.includes("published"),
  }
}
