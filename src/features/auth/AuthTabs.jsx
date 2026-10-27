import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils.js"

const base =
  "inline-flex h-11 items-center rounded-xl px-5 text-sm font-bold transition-colors"

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          base,
          isActive
            ? "bg-brand-gradient text-white"
            : "border border-line bg-card text-ink hover:bg-slate-50"
        )
      }
    >
      {children}
    </NavLink>
  )
}

export default function AuthTabs() {
  return (
    <nav aria-label="Daftar atau masuk" className="mb-5 flex gap-2">
      <Tab to="/register">Daftar</Tab>
      <Tab to="/login">Masuk</Tab>
    </nav>
  )
}
