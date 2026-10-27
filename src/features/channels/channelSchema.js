import { z } from "zod"
import { PLATFORMS } from "@/constant/platforms.js"

export const channelSchema = z.object({
  platform: z.enum(Object.keys(PLATFORMS), { message: "Platform wajib dipilih" }),
  handle_name: z.string().trim().min(1, "Handle wajib diisi").max(100, "Handle maksimal 100 karakter"),
})

export const channelDefaults = { platform: "youtube", handle_name: "" }
