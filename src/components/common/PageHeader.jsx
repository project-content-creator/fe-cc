export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-ink lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-ink">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </header>
  )
}
