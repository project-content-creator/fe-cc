import { cn } from "@/lib/utils.js"

export default function UserAvatar({ user, src, className }) {
  const url = src === undefined ? user?.avatar_url : src

  if (url) {
    return <img src={url} alt="" className={cn("rounded-full object-cover", className)} />
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-violet font-extrabold text-white",
        className
      )}
    >
      {user?.name?.[0]?.toUpperCase() ?? "?"}
    </span>
  )
}
