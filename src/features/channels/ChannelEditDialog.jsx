import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ChannelForm from "@/features/channels/ChannelForm"

export default function ChannelEditDialog({ channel, onClose, onSubmit }) {
  return (
    <Dialog open={Boolean(channel)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-7 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-ink">Edit Channel</DialogTitle>
          <DialogDescription className="sr-only">Ubah platform atau handle channel.</DialogDescription>
        </DialogHeader>
        {channel && (
          <ChannelForm
            key={channel.id}
            idPrefix="edit-channel"
            initialValues={{ platform: channel.platform, handle_name: channel.handle_name }}
            submitLabel="Simpan"
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
