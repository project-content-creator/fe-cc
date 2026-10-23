import { z } from "zod"
import { FORMAT_VALUES } from "@/constant/formats"
import { PRIORITY_VALUES } from "@/constant/priorities"

export function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

// Validasi sisi klien hanya untuk UX. Validasi utama (termasuk aturan published) tetap di server.
export const contentSchema = z
  .object({
    title: z.string().trim().min(1, "Judul wajib diisi").max(255, "Judul maksimal 255 karakter"),
    channel_id: z.string().min(1, "Channel wajib dipilih"),
    format_type: z.enum(FORMAT_VALUES, { message: "Format wajib dipilih" }),
    priority: z.enum(PRIORITY_VALUES),
    scheduled_date: z.string().optional(),
    description: z.string().optional(),
    script_draft: z.string().optional(),
    
    // Hanya dipakai di mode edit
    status: z.string().optional(),
    published_url: z.string().trim().optional(),
    published_date: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.status !== "published") return
    if (!values.published_url) {
      ctx.addIssue({ code: "custom", path: ["published_url"], message: "Published URL wajib diisi bila status = Published" })
    } else if (!isHttpUrl(values.published_url)) {
      ctx.addIssue({ code: "custom", path: ["published_url"], message: "Published URL tidak valid (awali dengan https://)" })
    }
  })

export const createDefaults = {
  title: "",
  channel_id: "",
  format_type: "short_video",
  priority: "medium",
  scheduled_date: "",
  description: "",
  script_draft: "",
}

export function toFormValues(content) {
  return {
    title: content.title,
    channel_id: String(content.channel?.id ?? content.channel_id ?? ""),
    format_type: content.format_type,
    priority: content.priority,
    scheduled_date: content.scheduled_date ?? "",
    script_draft: content.script_draft ?? "",
    status: content.status,
    published_url: content.published_url ?? "",
    published_date: content.published_date ?? "",
  }
}

const emptyToNull = (value) => (value === "" || value === undefined ? null : value)

export function toPayload(values) {
  const payload = {
    title: values.title,
    channel_id: Number(values.channel_id),
    format_type: values.format_type,
    priority: values.priority,
    scheduled_date: emptyToNull(values.scheduled_date),
    script_draft: emptyToNull(values.script_draft),
  }
  if (values.description !== undefined) payload.description = emptyToNull(values.description)
  if (values.status) {
    payload.status = values.status
    payload.published_url = emptyToNull(values.published_url)
    payload.published_date = emptyToNull(values.published_date)
  }
  return payload
}
