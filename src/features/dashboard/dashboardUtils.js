import { differenceInCalendarDays, parseISO } from "date-fns"

// Konten terjadwal 7 hari ke depan yang belum published, diurutkan dari yang terdekat.
export function getUpcoming(contents, today = new Date()) {
  return contents
    .filter((c) => c.scheduled_date && c.status !== "published")
    .filter((c) => {
      const days = differenceInCalendarDays(parseISO(c.scheduled_date), today)
      return days >= 0 && days <= 6
    })
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
}

// Konten yang butuh tindakan. Aturan ini asumsi UI; sesuaikan dengan kebutuhan tim.
export function getAttentionItems(contents, today = new Date()) {
  const items = []
  for (const c of contents) {
    if (c.status === "published") continue
    const days = c.scheduled_date ? differenceInCalendarDays(parseISO(c.scheduled_date), today) : null
    const done = c.checklist_done ?? 0
    const total = c.checklist_total ?? 0

    if (c.status === "ready") {
      items.push({ id: c.id, title: c.title, note: "Ready, belum dipublikasikan" })
    } else if (days === null && c.status === "idea") {
      items.push({ id: c.id, title: c.title, note: "Belum punya jadwal tayang" })
    } else if (days !== null && days < 0) {
      items.push({ id: c.id, title: c.title, note: `Lewat jadwal ${Math.abs(days)} hari` })
    } else if (days !== null && days <= 3 && done < total) {
      const when = days === 0 ? "hari ini" : `${days} hari lagi`
      items.push({ id: c.id, title: c.title, note: `Checklist ${done}/${total}, tayang ${when}` })
    }
  }
  return items.slice(0, 5)
}
