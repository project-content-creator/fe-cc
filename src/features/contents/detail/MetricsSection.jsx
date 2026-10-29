import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applyServerErrors } from "@/lib/formErrors.js"
import { formatDate, formatDateLong, formatNumber } from "@/lib/format.js"
import { brandBtn, cardClass, inputClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { addMetric } from "@/services/metric.service.js"

const count = (label) =>
  z.number({ message: `${label} harus berupa angka` })
    .int(`${label} harus bilangan bulat`)
    .min(0, `${label} tidak boleh negatif`)

const metricSchema = z.object({
  recorded_at: z.string().min(1, "Tanggal wajib diisi"),
  views_count: count("Views"),
  likes_count: count("Likes"),
  comments_count: count("Comments"),
  shares_count: count("Shares"),
})

const today = () => format(new Date(), "yyyy-MM-dd")
const byNewest = (a, b) => String(b.recorded_at).localeCompare(String(a.recorded_at))

function ViewsChart({ metrics }) {
  const points = metrics.slice(0, 7).reverse()
  const max = Math.max(...points.map((p) => p.views_count ?? 0), 1)
  return (
    <div role="img" aria-label="Grafik views per tanggal pencatatan" className="flex h-40 items-stretch gap-3">
      {points.map((point) => (
        <div key={point.id} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end">
            <div
              className="bg-brand-gradient w-full rounded-t-lg"
              style={{ height: `${Math.max(((point.views_count ?? 0) / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-ink">{formatDate(point.recorded_at)}</span>
        </div>
      ))}
    </div>
  )
}

const FIELDS = [
  ["views_count", "Views"],
  ["likes_count", "Likes"],
  ["comments_count", "Comments"],
  ["shares_count", "Shares"],
]

export default function MetricsSection({ contentId, isPublished, initialMetrics }) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(metricSchema), defaultValues: { recorded_at: today() } })

  if (!isPublished) {
    return (
      <section aria-labelledby="metrics-title" className={cn(cardClass, "p-6")}>
        <h2 id="metrics-title" className="mb-2 text-lg font-extrabold text-ink">Performa</h2>
        <p className="text-sm text-muted-ink">
          Metrik tersedia setelah konten dipublikasikan. Ubah status ke Published dan isi URL-nya terlebih dahulu.
        </p>
      </section>
    )
  }

  const onSubmit = async (values) => {
    try {
      const created = await addMetric(contentId, values)
      setMetrics((prev) => [created, ...prev].sort(byNewest))
      toast.success("Metrik berhasil dicatat")
      reset({ recorded_at: today() })
    } catch (err) {
      applyServerErrors(err, setError, "Gagal mencatat metrik. Coba lagi.")
    }
  }

  const latest = metrics[0]

  return (
    <>
      <section aria-labelledby="metrics-title" className={cn(cardClass, "p-6")}>
        <h2 id="metrics-title" className="mb-3 text-lg font-extrabold text-ink">Performa</h2>

        {metrics.length === 0 ? (
          <p className="text-sm text-muted-ink">Belum ada data. Catat metrik pertama di bawah.</p>
        ) : (
          <>
            <ViewsChart metrics={metrics} />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {FIELDS.map(([key, label]) => (
                <div key={key}>
                  <dd className="font-extrabold text-ink">{formatNumber(latest[key])}</dd>
                  <dt className="text-xs text-muted-ink">{label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-center text-xs text-muted-ink">Pencatatan terakhir: {formatDateLong(latest.recorded_at)}</p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-ink" style={{  minWidth: "420px" }}>
                <caption className="sr-only">Riwayat pencatatan metrik</caption>
                <thead>
                  <tr className="border-b border-surface-deep text-left text-xs text-muted-ink">
                    <th scope="col" className="py-2 font-medium">Tanggal</th>
                    {FIELDS.map(([key, label]) => (
                      <th key={key} scope="col" className="py-2 text-right font-medium">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="border-b border-surface-deep last:border-0">
                      <th scope="row" className="py-2 text-left font-medium">{formatDateLong(metric.recorded_at)}</th>
                      {FIELDS.map(([key]) => (
                        <td key={key} className="py-2 text-right">{formatNumber(metric[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="metric-form-title" className={cn(cardClass, "p-6")}>
        <h2 id="metric-form-title" className="mb-3 text-lg font-extrabold text-ink">Catat metrik</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {errors.root?.server && (
            <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
              {errors.root.server.message}
            </p>
          )}
          <FormField id="recorded_at" label="Tanggal pencatatan" error={errors.recorded_at?.message}>
            <Input id="recorded_at" type="date" className={inputClass} {...register("recorded_at")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map(([key, label]) => (
              <FormField key={key} id={key} label={label} error={errors[key]?.message}>
                <Input
                  id={key}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  className={inputClass}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  {...register(key, { valueAsNumber: true })}
                />
              </FormField>
            ))}
          </div>
          <Button type="submit" disabled={isSubmitting} className={brandBtn}>
            {isSubmitting ? "Menyimpan..." : "Simpan log"}
          </Button>
        </form>
      </section>
    </>
  )
}
