import { format } from "date-fns"

export const unwrap = (response) => response.data?.data ?? response.data

const toDate = (value) => {
  if (!value) return null
  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? text.slice(0, 10) : format(parsed, "yyyy-MM-dd")
}

export function normalizeChecklist(raw) {
  // MySQL boolean bisa datang sebagai 0/1
  return { ...raw, is_completed: Boolean(raw.is_completed) }
}

export function normalizeMetric(raw) {
  return { ...raw, recorded_at: toDate(raw.recorded_at) }
}

const byNewest = (a, b) => String(b.recorded_at).localeCompare(String(a.recorded_at))

export function normalizeContent(raw, channelsById = {}) {
  const channelId = raw.channel_id ?? raw.channel?.id
  const rawChecklists = raw.checklists ?? raw.content_checklists
  const rawMetrics = raw.metrics ?? raw.content_metrics
  const checklists = Array.isArray(rawChecklists) ? rawChecklists.map(normalizeChecklist) : undefined
  const metrics = Array.isArray(rawMetrics) ? rawMetrics.map(normalizeMetric).sort(byNewest) : undefined

  return {
    ...raw,
    channel_id: channelId,
    channel: raw.channel ?? channelsById[channelId] ?? null,
    scheduled_date: toDate(raw.scheduled_date),
    published_date: toDate(raw.published_date),
    checklists,
    metrics,
    checklist_total: raw.checklist_total ?? raw.checklists_count ?? checklists?.length,
    checklist_done:
      raw.checklist_done ?? raw.checklists_completed_count ?? checklists?.filter((c) => c.is_completed).length,
    latest_views: raw.latest_views ?? metrics?.[0]?.views_count ?? null,
    metrics_count: raw.metrics_count ?? metrics?.length,
  }
}

export function normalizeAuth(data, fallbackEmail) {
  const payload = data?.data ?? data
  const token = payload?.token ?? payload?.access_token
  const user = payload?.user ?? { name: fallbackEmail, email: fallbackEmail, role: "creator" }
  return { token, user }
}
