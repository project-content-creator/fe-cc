// Satu-satunya tempat yang tahu bentuk respons mentah backend.
// Jika nama field di API berbeda, cukup ubah file ini.

export const unwrap = (response) => response.data?.data ?? response.data

// Kolom DATE bisa datang sebagai "2026-10-18" atau "2026-10-18T00:00:00.000000Z".
const toDate = (value) => (value ? String(value).slice(0, 10) : null)

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
    // Ringkasan untuk daftar: dipakai jika backend menyediakannya, atau dihitung dari relasi.
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
  // Jika backend tidak mengirim objek user, pakai email sebagai nama sementara.
  const user = payload?.user ?? { name: fallbackEmail, email: fallbackEmail, role: "creator" }
  return { token, user }
}
