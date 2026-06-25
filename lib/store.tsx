"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react"
import { saveProject } from "@/lib/services/save-project"
import { loadProjects, saveProjects } from "@/lib/services/storage"
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

  updateCurrent: (patch: any) => void
  saveCurrent: () => void

  totals: any
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  const [projects, setProjects] = useState<Project[]>([])
  const [current, setCurrent] = useState<Project | null>(null)

  const go = (s: ScreenKey) => setScreen(s)

  const t = (key: string) =>
    dict[key as keyof typeof dict]?.[lang] ?? key

  // LOAD ON START
  useEffect(() => {
    const data = loadProjects()
    setProjects(data)
  }, [])

  //  SAVE HELPER
  const persist = (next: Project[]) => {
    setProjects(next)
    saveProjects(next)
  }

  //  CREATE PROJECT
  const startProject = (_: string | null) => {
    const project = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      type: null,
      customer: {
        name: "",
        phone: "",
        email: "",
        address: "",
        zip: "",
      },
      lineItems: [],
      estimate: {
        laborRate: 60,
        wastePct: 10,
        profitPct: 20,
        taxPct: 7,
        discount: 0,
      },
    }

    const next = [project, ...projects]
    persist(next)

    setCurrent(project)
    go("estimate")
  }

  //  OPEN PROJECT
  const openProject = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return

    setCurrent(project)
    go("estimate")
  }

  // ✏️ UPDATE CURRENT
  const updateCurrent = (patch: any) => {
    setCurrent((prev: any) => {
      if (!prev) return prev

      const updated = { ...prev, ...patch }

      const next = projects.map((p) =>
        p.id === updated.id ? updated : p
      )

      persist(next)

      return updated
    })
  }

  const saveCurrent = () => {
    console.log("saving project", current)
  }

  const totals = {
    materials: 0,
    labor: 0,
    subtotal: 0,
    withProfit: 0,
    tax: 0,
    total: 0,
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
      updateCurrent,
      saveCurrent,

      totals,
    }),
    [lang, screen, current, projects]
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
