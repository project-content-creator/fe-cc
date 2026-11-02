import { useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/common/ConfirmDialog"
import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PageHeader from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { ROLE_MAP } from "@/constant/roles.js"
import UserFormDialog from "@/features/users/UserFormDialog"
import { useAuth } from "@/hooks/useAuth.js"
import { useUsers } from "@/hooks/useUsers.js"
import { formatDateLong } from "@/lib/format.js"
import { brandBtn, cardClass, outlineBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { deleteUserById } from "@/services/user.service.js"

const small = "h-10 px-4"

// Khusus admin: kelola semua akun dan role.
export default function UsersPage() {
  const { user: me } = useAuth()
  const { data: users, loading, error, reload } = useUsers()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (target) => {
    setEditing(target)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteUserById(deleting.id)
      toast.success("User berhasil dihapus")
      setDeleting(null)
      reload()
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal menghapus user. Coba lagi.")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="User Management" subtitle="Kelola akun dan role pengguna">
        <Button onClick={openCreate} className={brandBtn}>+ Tambah user</Button>
      </PageHeader>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <LoadingBlock className="h-72" />
      ) : users.length === 0 ? (
        <EmptyState title="Belum ada user" />
      ) : (
        <div className={cn(cardClass, "overflow-x-auto p-6")}>
          <table className="w-full min-w-160 border-collapse text-sm text-ink">
            <thead>
              <tr className="border-b border-surface-deep text-left text-muted-ink">
                <th scope="col" className="pb-3 font-medium">Nama</th>
                <th scope="col" className="pb-3 font-medium">Email</th>
                <th scope="col" className="pb-3 font-medium">Role</th>
                <th scope="col" className="pb-3 font-medium">Dibuat</th>
                <th scope="col" className="pb-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const isSelf = item.id === me?.id
                const role = ROLE_MAP[item.role]
                return (
                  <tr key={item.id} className="border-b border-surface-deep last:border-0">
                    <th scope="row" className="py-3 pr-4 text-left font-bold">
                      {item.name}
                      {isSelf && <span className="ml-2 text-xs font-normal text-muted-ink">(kamu)</span>}
                    </th>
                    <td className="py-3 pr-4">{item.email}</td>
                    <td className="py-3 pr-4">
                      <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-bold", role?.className)}>
                        {role?.label ?? item.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{formatDateLong(item.created_at?.slice(0, 10))}</td>
                    <td className="py-3">
                      <div className="flex gap-1.5">
                        <Button variant="outline" onClick={() => openEdit(item)} className={cn(outlineBtn, small)}>
                          Edit
                        </Button>
                        {!isSelf && (
                          <Button
                            variant="outline"
                            onClick={() => setDeleting(item)}
                            className={cn(outlineBtn, small, "text-danger hover:text-danger")}
                          >
                            Hapus
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-ink">Menampilkan {users.length} user</p>
        </div>
      )}

      <UserFormDialog
        open={formOpen}
        user={editing}
        isSelf={editing?.id === me?.id}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false)
          reload()
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !deleteLoading && setDeleting(null)}
        title="Hapus user ini?"
        description={
          deleting && (
            <>
              Akun <b className="text-ink">{deleting.name}</b> ({deleting.email}) akan dihapus permanen. Semua channel
              dan konten milik user ini juga ikut terhapus. Tindakan ini tidak bisa dibatalkan.
            </>
          )
        }
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </>
  )
}
