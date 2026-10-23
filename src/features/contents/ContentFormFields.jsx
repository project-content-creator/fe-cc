import { Controller, useWatch } from "react-hook-form"

import ChipGroup from "@/components/common/ChipGroup"
import FormField from "@/components/common/FormField"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FORMATS } from "@/constant/formats"
import { PLATFORMS } from "@/constant/platforms"
import { PRIORITIES } from "@/constant/priorities"
import { STATUSES } from "@/constant/status"
import { inputClass, selectTriggerClass } from "@/lib/styles"

const textareaClass = "rounded-xl border-line bg-white px-4 py-3 text-base text-ink focus-visible:border-brand-violet focus-visible:ring-brand-violet/30"

// Dipakai bersama oleh halaman Buat Konten (mode "create") dan pop-up Edit (mode "edit").
export default function ContentFormFields({ mode, form, channels }) {
  const { register, control, formState: { errors } } = form
  const status = useWatch({ control, name: "status" })
  const isEdit = mode === "edit"

  const invalid = (name) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  })

  return (
    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
      <FormField id="title" label="Judul *" error={errors.title?.message}>
        <Input id="title" className={inputClass} {...invalid("title")} {...register("title")} />
      </FormField>

      <FormField id="channel_id" label="Channel *" error={errors.channel_id?.message}>
        <Controller
          name="channel_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="channel_id" className={selectTriggerClass} {...invalid("channel_id")}>
                <SelectValue placeholder="Pilih channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={String(channel.id)}>
                    {PLATFORMS[channel.platform]?.label} - {channel.handle_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Format *" error={errors.format_type?.message}>
        <Controller
          name="format_type"
          control={control}
          render={({ field }) => (
            <ChipGroup label="Format konten" options={FORMATS} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="Prioritas">
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <ChipGroup label="Prioritas" options={PRIORITIES} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField id="scheduled_date" label={isEdit ? "Tanggal rilis" : "Tanggal rilis (scheduled_date)"} error={errors.scheduled_date?.message}>
        <Input id="scheduled_date" type="date" className={inputClass} {...register("scheduled_date")} />
      </FormField>

      {isEdit ? (
        <>
          <FormField id="status" label="Status">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            id="published_url"
            label={status === "published" ? "Published URL *" : "Published URL"}
            hint="Wajib diisi bila status = Published"
            error={errors.published_url?.message}
          >
            <Input id="published_url" type="url" inputMode="url" className={inputClass} {...invalid("published_url")} {...register("published_url")} />
          </FormField>

          <FormField id="published_date" label="Tanggal tayang">
            <Input id="published_date" type="date" className={inputClass} {...register("published_date")} />
          </FormField>
        </>
      ) : (
        <FormField id="description" label="Deskripsi / konsep singkat">
          <Textarea id="description" rows={4} className={textareaClass} {...register("description")} />
        </FormField>
      )}

      <FormField id="script_draft" label="Script draft" className={isEdit ? "md:col-span-2" : ""}>
        <Textarea
          id="script_draft"
          rows={isEdit ? 4 : 7}
          placeholder="Tulis hook dan alur cerita..."
          className={textareaClass}
          {...register("script_draft")}
        />
      </FormField>
    </div>
  )
}
