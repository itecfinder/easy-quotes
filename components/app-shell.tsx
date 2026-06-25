"use client"

import { HardHat, Home, FolderClock, Settings as SettingsIcon } from "lucide-react"
import { useApp } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { ScreenKey } from "@/lib/types"

import { Dashboard } from "./screens/dashboard"
import { ProjectCapture } from "./screens/project-capture"
import { ScanAnalysis } from "./screens/scan-analysis"
import { EstimateEditor } from "./screens/estimate-editor"
import { PriceComparison } from "./screens/price-comparison"
import { InvoiceBuilder } from "./screens/invoice-builder"
import { History } from "./screens/history"
import { Settings } from "./screens/settings"

const tabs: { key: ScreenKey; icon: typeof Home; labelKey: "navHome" | "navProjects" | "navSettings" }[] = [
  { key: "dashboard", icon: Home, labelKey: "navHome" },
  { key: "history", icon: FolderClock, labelKey: "navProjects" },
  { key: "settings", icon: SettingsIcon, labelKey: "navSettings" },
]

function Screen() {
  const { screen } = useApp()

  if (screen === "dashboard") return <Dashboard />
  if (screen === "capture") return <ProjectCapture />
  if (screen === "scan") return <ScanAnalysis />
  if (screen === "estimate") return <EstimateEditor />
  if (screen === "prices") return <PriceComparison />
  if (screen === "invoice") return <InvoiceBuilder />
  if (screen === "history") return <History />
  if (screen === "settings") return <Settings />

  return <Dashboard />
}

export function AppShell() {
  const { t, lang, setLang, screen, go } = useApp()

  const activeTab =
    screen === "history"
      ? "history"
      : screen === "settings"
      ? "settings"
      : "dashboard"

  return (
    <div className="flex min-h-screen w-full justify-center bg-secondary/20 md:py-6">
      <div className="relative flex min-h-screen w-full max-w-md flex-col bg-background shadow-xl md:min-h-[844px] md:rounded-[2rem] md:border md:border-border">

        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-secondary px-4 py-3 text-secondary-foreground md:rounded-t-[2rem]">

          <button
            onClick={() => go("dashboard")}
            className="flex items-center gap-2"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HardHat className="size-5" />
            </span>

            <span className="text-lg font-bold tracking-tight">
              {t("appName")}
            </span>
          </button>

          <div className="flex items-center gap-1">
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-2 py-1 text-xs uppercase rounded",
                  lang === l ? "bg-primary text-white" : "opacity-60"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-40">
          <Screen />
        </main>

        {/* Bottom nav */}
        <nav className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-border bg-card px-2 py-2">

          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => go(tab.key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {t(tab.labelKey)}
              </button>
            )
          })}

        </nav>

      </div>
    </div>
  )
}
