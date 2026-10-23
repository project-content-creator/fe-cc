import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/layout/AppSidebar"

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-surface text-ink lg:flex-row">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
