import { useState } from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import ConfirmDialog from "@/components/common/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth.js"
import { cardClass, outlineBtn } from "@/lib/styles.js"
import { cn } from "@/lib/utils.js"
import { logoutRequest } from "@/services/account.service.js"

export default function LogoutCard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    setLoading(true)
    await logoutRequest()
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <section className={cn(cardClass, "flex items-center justify-between gap-4 p-6")}>
      <div>
        <h2 className="font-bold text-ink">Keluar Akun</h2>
        <p className="text-sm text-muted-ink">Sesi Di Device Ini Akan Berakhir</p>
      </div>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(outlineBtn, "text-danger hover:text-danger")}
      >
        Logout
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={(value) => !loading && setOpen(value)}
        icon={LogOut}
        title="Apakah Anda Yakin Ingin Keluar Akun?"
        description="Sesi Di Device Ini Akan Berakhir dan Kamu Perlu Login Lagi..."
        confirmLabel="Ya, Keluar"
        loadingLabel="Keluar..."
        loading={loading}
        onConfirm={confirm}
      />
    </section>
  )
}
