import StatusBadge from "@/components/common/StatusBadge"
import { STATUSES } from "@/constant/status.js"
import logoLockup from "@/assets/logo-lockup.png"

export default function AuthLayout({ headline, description, children }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="bg-brand-gradient hidden flex-col justify-center gap-5 p-16 text-white lg:flex">
        <h1 className="max-w-md text-4xl leading-tight font-extrabold xl:text-5xl">
          {headline}
        </h1>
        <p className="max-w-sm text-lg text-white/90">{description}</p>
        <ul className="flex flex-wrap gap-2.5">
          {STATUSES.map((status) => (
            <li key={status.value}>
              <StatusBadge
                status={status.value}
                className="px-4 py-2 text-sm font-medium"
              />
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex items-center justify-center bg-card p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <img
            src={logoLockup}
            alt="CreatorTrack - Content & Pipeline Tracker"
            className="mb-8 w-72 max-w-full"
          />
          {children}
        </div>
      </main>
    </div>
  )
}
