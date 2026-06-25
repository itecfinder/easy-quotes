"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"
import type { ScreenKey } from "./types"

type Lang = "en" | "es"

type Project = any

type AppContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  screen: ScreenKey
  go: (s: ScreenKey) => void
  t: (key: string) => string
  projects: Project[]
  openProject: (id: string) => void
  startProject: (id: string | null) => void
  money: (n: number) => string
}

const AppContext = createContext<AppContextType | null>(null)

const dict: Record<Lang, Record<string, string>> = {
  en: { appName: "Easy Quotes" },
  es: { appName: "Cotizaciones" },
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  // ALWAYS initialized (never undefined)
  const [projects] = useState<Project[]>([])

  const go = (s: ScreenKey) => setScreen(s)

  const t = (key: string) => dict[lang]?.[key] ?? key

  const openProject = (id: string) => {
    console.log("open", id)
  }

  const startProject = (_: string | null) => {
    console.log("new project")
  }

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(n)

  const value = useMemo(
    () => ({
      lang,
      setLang,
      screen,
      go,
      t,
      projects,
      openProject,
      startProject,
      money,
    }),
    [lang, screen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
