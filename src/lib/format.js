import { format, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"

export function formatDate(value) {
  if (!value) return "-"
  return format(parseISO(value), "d MMM", { locale: localeId })
}

export function formatCompact(value) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 })
    .format(value ?? 0)
    .replace(/\s/g, "")
}

export function formatDateLong(value) {
  if (!value) return "-"
  return format(parseISO(value), "d MMM yyyy", { locale: localeId })
}

export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value ?? 0)
}