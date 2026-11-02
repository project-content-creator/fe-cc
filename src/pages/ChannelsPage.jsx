import { useMemo, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/common/ConfirmDialog"
import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PageHeader from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { PLATFORMS } from "@/constant/platforms.js"
import ChannelCard from "@/features/channels/ChannelCard"
import ChannelEditDialog from "@/features/channels/ChannelEditDialog"
import ChannelForm from "@/features/channels/ChannelForm"
import { useAuth } from "@/hooks/useAuth.js"
import { useChannels } from "@/hooks/useChannels.js"
import { useContents } from "@/hooks/useContents.js"
import { canCreateChannel, canManageChannel } from "@/lib/permissions.js"
import { brandBtn, cardClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { createChannel, deleteChannel, updateChannel } from "@/services/channel.service.js"

export default function ChannelsPage() {
  const { user } = useAuth()
  const canCreate = canCreateChannel(user)
  const { data: channels, loading, error, reload } = useChannels()
  const { data: contents } = useContents()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const countByChannel = useMemo(() => {
    const counts = {}
    contents.forEach((content) => {
      counts[content.channel_id] = (counts[content.channel_id] ?? 0) + 1
    })
    return counts
  }, [contents])

  const handleCreate = async (payload) => {
    await createChannel(payload)
    toast.success("Channel berhasil ditambahkan")
    reload()
  }

  const handleUpdate = async (payload) => {
    await updateChannel(editing.id, payload)
    toast.success("Channel berhasil diperbarui")
    setEditing(null)
    reload()
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteChannel(deleting.id)
      toast.success("Channel berhasil dihapus")
      setDeleting(null)
      reload()
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal menghapus channel. Coba lagi.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const deletingCount = deleting ? (deleting.contents_count ?? countByChannel[deleting.id] ?? 0) : 0

  return (
    <>
      <PageHeader
        title="Channels"
        subtitle={canCreate ? "Kelola akun media sosial yang kamu kelola" : "Daftar akun media sosial tim"}
      >
        {canCreate && (
          <Button nativeButton={false} render={<a href="#tambah-channel" />} className={brandBtn}>
            + Tambah channel
          </Button>
        )}
      </PageHeader>

      <div className={cn("grid items-start gap-4", canCreate && "lg:grid-cols-2")}>
        <div className="flex min-w-0 flex-col gap-4">
          {error ? (
            <ErrorState onRetry={reload} />
          ) : loading ? (
            <LoadingBlock className="h-40" />
          ) : channels.length === 0 ? (
            <EmptyState title="Belum ada channel" description={canCreate ? "Tambahkan channel pertamamu lewat form di samping." : "Belum ada channel yang terdaftar."} />
          ) : (
            channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                contentCount={channel.contents_count ?? countByChannel[channel.id] ?? 0}
                canManage={canManageChannel(user, channel)}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            ))
          )}
        </div>

        {canCreate && (
          <section id="tambah-channel" aria-labelledby="add-channel-title" className={cn(cardClass, "scroll-mt-6 p-6")}>
            <h2 id="add-channel-title" className="mb-4 text-lg font-extrabold text-ink">Tambah channel</h2>
            <ChannelForm idPrefix="add-channel" submitLabel="Simpan channel" onSubmit={handleCreate} resetOnSuccess />
          </section>
        )}
      </div>

      <ChannelEditDialog channel={editing} onClose={() => setEditing(null)} onSubmit={handleUpdate} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !deleteLoading && setDeleting(null)}
        title="Hapus channel ini?"
        description={
          deleting && (
            <>
              Channel <b className="text-ink">{deleting.handle_name} ({PLATFORMS[deleting.platform]?.label})</b> akan
              dihapus permanen.
              {deletingCount > 0 && ` ${deletingCount} konten di channel ini juga akan ikut terhapus.`} Tindakan ini
              tidak bisa dibatalkan.
            </>
          )
        }
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </>
  )
}
