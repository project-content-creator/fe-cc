import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLES } from "@/constant/roles.js"
import { createUserSchema } from "@/features/users/userSchema.js"
import { applyServerErrors } from "@/lib/formErrors.js"
import { brandBtn, inputClass, outlineBtn, selectTriggerClass } from "@/lib/styles.js"
import { createUser, updateUserById } from "@/services/user.service.js"

function UserForm({ user, isSelf, onClose, onSaved }) {
  const mode = user ? "edit" : "create"
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema(mode)),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", password: "", role: user?.role ?? "creator" },
  })

  const onSubmit = async (values) => {
    const payload = { name: values.name, email: values.email, role: values.role }
    if (values.password) payload.password = values.password
    try {
      if (user) await updateUserById(user.id, payload)
      else await createUser(payload)
      toast.success(user ? "User berhasil diperbarui" : "User berhasil ditambahkan")
      onSaved()
    } catch (err) {
      applyServerErrors(err, setError, "Gagal menyimpan user. Coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.server && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {errors.root.server.message}
        </p>
      )}

      <FormField id="user-name" label="Nama lengkap *" error={errors.name?.message}>
        <Input
          id="user-name"
          autoComplete="off"
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "user-name-error" : undefined}
          {...register("name")}
        />
      </FormField>

      <FormField id="user-email" label="Email *" error={errors.email?.message}>
        <Input
          id="user-email"
          type="email"
          autoComplete="off"
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "user-email-error" : undefined}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="user-password"
        label={user ? "Password baru" : "Password *"}
        hint={user ? "Kosongkan jika tidak ingin mengganti password." : "Minimal 8 karakter."}
        error={errors.password?.message}
      >
        <Input
          id="user-password"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "user-password-error" : undefined}
          {...register("password")}
        />
      </FormField>

      <FormField
        id="user-role"
        label="Role *"
        hint={isSelf ? "Role akunmu sendiri tidak bisa diubah di sini." : undefined}
        error={errors.role?.message}
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} items={ROLES} disabled={isSelf}>
              <SelectTrigger id="user-role" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className={outlineBtn}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className={brandBtn}>
          {isSubmitting ? "Menyimpan..." : user ? "Simpan perubahan" : "Tambah user"}
        </Button>
      </div>
    </form>
  )
}

// user = null -> mode tambah; user = objek -> mode edit.
export default function UserFormDialog({ open, user, isSelf, onClose, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[92svh] max-w-lg overflow-y-auto rounded-3xl p-7 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-ink">{user ? "Edit User" : "Tambah User"}</DialogTitle>
          <DialogDescription className="text-sm text-muted-ink">
            {user ? "Ubah data akun dan role pengguna." : "Buat akun baru dan tentukan role-nya."}
          </DialogDescription>
        </DialogHeader>
        {open && <UserForm key={user?.id ?? "baru"} user={user} isSelf={isSelf} onClose={onClose} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
