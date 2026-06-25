import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"

export default function Page() {
  return (
    <>
      <AppShell />
      <Toaster position="top-center" />
    </>
  )
}

