import PageHeader from "@/components/common/PageHeader"
import LogoutCard from "@/features/settings/LogoutCard"
import PasswordCard from "@/features/settings/PasswordCard"
import ProfileCard from "@/features/settings/ProfileCard"
import ThemeCard from "@/features/settings/ThemeCard"

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Atur profil, tampilan, dan keamanan akun" />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <ProfileCard />
          <ThemeCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <PasswordCard />
          <LogoutCard />
        </div>
      </div>
    </>
  )
}
