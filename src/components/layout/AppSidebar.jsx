import { useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { BarChart3, Check, ChevronDown, FileText, LayoutGrid, LogOut, Settings, User } from "lucide-react"
import logoIcon from "@/assets/logo-icon.png"
import UserAvatar from "@/components/common/UserAvatar"
import { useAuth } from "@/hooks/useAuth.js"
import { cn } from "@/lib/utils.js"
import { logoutRequest } from "@/services/account.service.js"

const baseItem = "flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors"
const idle = "text-nav-ink hover:bg-white/5 hover:text-white"
const active = "bg-brand-gradient font-bold text-white"

function NavItem({ to, icon: Icon, end, children }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => cn(baseItem, isActive ? active : idle)}>
      <Icon className="size-4.5" aria-hidden="true" />
      {children}
    </NavLink>
  )
}

function SubItem({ to, isActive, children }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={cn(baseItem, "ml-8 h-10", isActive ? active : idle)}
    >
      {children}
    </Link>
  )
}

function LogoutButton (){
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);

  const handleLogout = async () => {
    if (loading) return
    setLoading(true)
    await logoutRequest()
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <button type="button" onClick={handleLogout} disabled={loading} aria-label="Logout" title="Logout" className={cn("flex size-9 flex-none items-center justify-center rounded-xl transition-colors text-nav-ink hover:bg-white/10 hover:text-white disabled:opacity-50")}>
      <LogOut className="size-4.5" aria-hidden="true"/>
    </button>
  )
}

export default function AppSidebar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const inContent = pathname.startsWith("/content")
  const listActive = pathname === "/content" || (inContent && pathname !== "/content/new")
  const [open, setOpen] = useState(() => inContent)

  return (
    <aside className="flex w-full flex-none flex-col gap-1 bg-nav p-4 lg:sticky lg:top-0 lg:h-svh lg:w-58">
      <div className="mb-6 flex items-center gap-2.5 px-1 pt-1">
        <img src={logoIcon} alt="" className="size-10" />
        <span className="text-lg font-bold text-white">Creator Track</span>
      </div>

      <nav aria-label="Menu utama" className="flex flex-col gap-1">
        <NavItem to="/" end icon={LayoutGrid}>Dashboard</NavItem>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="content-submenu"
          className={cn(baseItem, "w-full", inContent ? "bg-white/10 text-white" : idle)}
        >
          <FileText className="size-4.5" aria-hidden="true" />
          Content
          <ChevronDown
            className={cn("ml-auto size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div id="content-submenu" className="flex flex-col gap-1">
            <SubItem to="/content" isActive={listActive}>Content List</SubItem>
            <SubItem to="/content/new" isActive={pathname === "/content/new"}>Buat Konten</SubItem>
          </div>
        )}

        <NavItem to="/pipeline" icon={Check}>Pipeline</NavItem>
        <NavItem to="/analytics" icon={BarChart3}>Analytics</NavItem>
        <NavItem to="/channels" icon={User}>Channels</NavItem>
        <NavItem to="/settings" icon={Settings}>Settings</NavItem>
      </nav>

      <div className="mt-auto flex items-center gap-3 px-1 pt-6">
        <UserAvatar user={user} className="size-9" />
        <div className="min-w-0 flex-1 text-sm leading-tight text-white">
          <p className="truncate font-semibold">{user?.name}</p>
          <span className="block text-nav-ink">{user?.role}</span>
        </div>
        <LogoutButton/>
      </div>
    </aside>
  )
}
