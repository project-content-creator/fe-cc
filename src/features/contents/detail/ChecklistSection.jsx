import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { brandBtn, cardClass, inputClass } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { addChecklist, deleteChecklist, toggleChecklist } from "@/services/checklist.service.js"

export default function ChecklistSection({ contentId, initialItems }) {
  const [items, setItems] = useState(initialItems)
  const [task, setTask] = useState("")
  const [error, setError] = useState("")
  const [adding, setAdding] = useState(false)
  const doneCount = items.filter((item) => item.is_completed).length

  const handleToggle = async (item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_completed: !i.is_completed } : i)))
    try {
      await toggleChecklist(item.id, item.is_completed)
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_completed: item.is_completed } : i)))
      toast.error("Gagal memperbarui checklist. Coba lagi.")
    }
  }

  const handleDelete = async (item) => {
    const snapshot = items
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    try {
      await deleteChecklist(item.id)
    } catch {
      setItems(snapshot)
      toast.error("Gagal menghapus tugas. Coba lagi.")
    }
  }

  const handleAdd = async (event) => {
    event.preventDefault()
    const name = task.trim()
    if (!name) {
      setError("Nama tugas wajib diisi")
      return
    }
    setAdding(true)
    setError("")
    try {
      const created = await addChecklist(contentId, name)
      setItems((prev) => [...prev, created])
      setTask("")
    } catch (err) {
      setError(err.response?.data?.errors?.task_name?.[0] ?? "Gagal menambah tugas. Coba lagi.")
    } finally {
      setAdding(false)
    }
  }

  return (
    <section aria-labelledby="checklist-title" className={cn(cardClass, "p-6")}>
      <div className="mb-3 flex items-center justify-between">
        <h2 id="checklist-title" className="text-lg font-extrabold text-ink">Checklist produksi</h2>
        <span className="rounded-full bg-chip px-3 py-1 text-xs font-bold text-chip-ink">
          {doneCount}/{items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-3 text-sm text-muted-ink">Belum ada tugas. Tambahkan checklist produksi pertama.</p>
      ) : (
        <ul className="mb-4 divide-y divide-surface-deep">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={item.is_completed}
                  onChange={() => handleToggle(item)}
                  className="size-5 flex-none accent-brand-violet"
                />
                <span className={cn("break-all", item.is_completed && "text-muted-ink line-through")}>
                  {item.task_name}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                aria-label={`Hapus tugas ${item.task_name}`}
                className="flex size-9 flex-none items-center justify-center rounded-lg text-muted-ink hover:bg-danger/10 hover:text-danger focus-visible:ring-3 focus-visible:ring-brand-violet/40 focus-visible:outline-none"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} noValidate>
        <div className="flex gap-2">
          <Input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            maxLength={255}
            placeholder="Tambah tugas baru"
            aria-label="Nama tugas baru"
            aria-invalid={!!error}
            className={inputClass}
          />
          <Button type="submit" disabled={adding} className={cn(brandBtn, "h-12")}>
            {adding ? "..." : "Tambah"}
          </Button>
        </div>
        {error && <p role="alert" className="mt-1.5 text-xs font-semibold text-danger">{error}</p>}
      </form>
    </section>
  )
}
