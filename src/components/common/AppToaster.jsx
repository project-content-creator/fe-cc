import { Toaster } from "sonner"
import { useTheme } from "@/hooks/useTheme"

export default function AppToaster() {
  const { theme } = useTheme()
  return <Toaster richColors position="top-right" theme={theme} />
}
