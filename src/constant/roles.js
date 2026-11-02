export const ROLES = [
  { value: "admin", label: "Admin", className: "bg-[#ffe9d2] text-[#8a3b00]" },
  { value: "creator", label: "Creator", className: "bg-[#dce6ff] text-[#1b3a9e]" },
  { value: "editor", label: "Editor", className: "bg-[#ebdeff] text-[#5b22b8]" },
]

export const ROLE_MAP = Object.fromEntries(ROLES.map((role) => [role.value, role]))
