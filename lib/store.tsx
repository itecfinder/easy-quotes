"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"
import type { ScreenKey } from "./types"
import { dict } from "./i18n"

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

  current: Project | null
  setCurrent: (p: Project | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  const [projects] = useState<Project[]>([])
  const [current, setCurrent] = useState<Project | null>(null)

  const go = (s: ScreenKey) => setScreen(s)

  const t = (key: string) =>
    dict[key as keyof typeof dict]?.[lang] ?? key

  const openProject = (id: string) => {
    console.log("open", id)
  }

  const startProject = (_: string | null) => {
    console.log("new project")

    const project = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      type: null,
      lineItems: [],
      estimate: {
        laborRate: 0,
        wastePct: 0,
        profitPct: 0,
        taxPct: 0,
        discount: 0,
      },
    }

    setCurrent(project)
    go("estimate")
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
      current,
      setCurrent,
    }),
    [lang, screen, current]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
