import { useEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FeedbackDialog from "@/components/common/FeedbackDialog"
import FormField from "@/components/common/FormField"
import UserAvatar from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth.js"
import { applyServerErrors } from "@/lib/formErrors.js"
import { brandBtn, cardClass, inputClass, outlineBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { updateProfile } from "@/services/account.service.js"

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const PHOTO_TYPES = ["image/jpeg", "image/png"]

const profileSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
})

export default function ProfileCard() {
  const { user, updateUser } = useAuth()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [removed, setRemoved] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  })

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const avatarSrc = preview ?? (removed ? null : user?.avatar_url ?? null)

  const handleFile = (event) => {
    const picked = event.target.files?.[0]
    event.target.value = "" // agar file yang sama bisa dipilih ulang
    if (!picked) return
    if (!PHOTO_TYPES.includes(picked.type)) return setPhotoError("Format foto harus JPG atau PNG.")
    if (picked.size > MAX_PHOTO_BYTES) return setPhotoError("Ukuran foto maksimal 2 MB.")
    setPhotoError("")
    setRemoved(false)
    setFile(picked)
  }

  const handleRemove = () => {
    setFile(null)
    setPhotoError("")
    setRemoved(true)
  }

  const onSubmit = async (values) => {
    try {
      const updated = await updateProfile({ ...values, avatar: file, removeAvatar: removed && !file })
      updateUser(
        updated?.name ? updated : { ...values, ...(removed && !file ? { avatar_url: null } : {}) }
      )
      setFile(null)
      setRemoved(false)
      setSaved(true)
    } catch (err) {
      applyServerErrors(err, setError, "Gagal menyimpan profil. Coba lagi.")
    }
  }

  return (
    <section aria-labelledby="profile-title" className={cn(cardClass, "p-6")}>
      <h2 id="profile-title" className="mb-4 text-lg font-extrabold text-ink">Profil</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root?.server && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {errors.root.server.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <UserAvatar user={user} src={avatarSrc} className="size-22 text-3xl" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Ubah foto profil"
              className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-line bg-card text-violet-ink focus-visible:ring-3 focus-visible:ring-brand-violet/40 focus-visible:outline-none"
            >
              <Camera className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => inputRef.current?.click()} className={brandBtn}>
                Unggah foto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={!avatarSrc}
                className={outlineBtn}
              >
                Hapus foto
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-ink">JPG atau PNG, maksimal 2 MB</p>
            {photoError && <p role="alert" className="mt-1 text-xs font-semibold text-danger">{photoError}</p>}
            <input
              ref={inputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFile}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>

        <span className="inline-block rounded-full bg-violet-soft px-3 py-1 text-xs font-bold text-violet-ink">
          Role: {user?.role}
        </span>

        <FormField id="profile-name" label="Nama lengkap" error={errors.name?.message}>
          <Input
            id="profile-name"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            {...register("name")}
          />
        </FormField>

        <FormField id="profile-email" label="Email" error={errors.email?.message}>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "profile-email-error" : undefined}
            {...register("email")}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Menyimpan..." : "Simpan profil"}
        </Button>
      </form>

      <FeedbackDialog
        open={saved}
        onOpenChange={setSaved}
        title="Profil berhasil disimpan"
        description="Perubahan nama, email, dan foto profil kamu sudah tersimpan."
      />
    </section>
  )
}
