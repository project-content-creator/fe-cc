import { z } from "zod"
import { ROLES } from "@/constant/roles.js"

export function createUserSchema(mode) {
  return z
    .object({
      name: z.string().trim().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
      email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid").max(191, "Email maksimal 191 karakter"),
      password: z.string().optional(),
      role: z.enum(ROLES.map((role) => role.value), { message: "Role wajib dipilih" }),
    })
    .superRefine((values, ctx) => {
      const password = values.password ?? ""
      const required = mode === "create"
      if ((required || password) && password.length < 8) {
        ctx.addIssue({ code: "custom", path: ["password"], message: "Password minimal 8 karakter" })
      } else if (password.length > 72) {
        ctx.addIssue({ code: "custom", path: ["password"], message: "Password maksimal 72 karakter" })
      }
    })
}
