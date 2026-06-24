"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { computeTotals, type Totals } from "@/lib/services/pricing"
import { blankProject } from "@/lib/services/projects"
import { translate, type DictKey } from "./i18n"

import type {
  BusinessProfile,
  Lang,
  Project,
  ProjectTypeKey,
  ScreenKey,
} from "./types"

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: DictKey) => string

  screen: ScreenKey
  go: (s: ScreenKey) => void

  business: BusinessProfile
  setBusiness: (b: BusinessProfile) => void

  projects: Project[]
  current: Project | null

  startProject: (type?: ProjectTypeKey | null) => void
  openProject: (id: string) => void
  updateCurrent: (patch: Partial<Project>) => void
  saveCurrent: () => void

  totals: Totals
  money: (n: number) => string
}

const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  const [projects, setProjects] = useState<Project[]>([])
  const [current, setCurrent] = useState<Project | null>(null)

  const [business, setBusiness] = useState<BusinessProfile>({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    logoUrl: null,
    preferredStore: "homeDepot",
    currency: "USD",
  })

  const t = useCallback(
    (k: DictKey) => translate(k, lang),
    [lang]
  )

  const go = useCallback((next: ScreenKey) => {
    setScreen((prev) => (prev === next ? prev : next))
  }, [])

  const startProject = useCallback(
    (type: ProjectTypeKey | null = null) => {
      setCurrent(blankProject(type))
      setScreen("projectCapture")
    },
    []
  )

  const openProject = useCallback(
    (id: string) => {
      const project = projects.find((p) => p.id === id)

      if (!project) return

      setCurrent({ ...project })

      setScreen(
        project.status === "draft"
          ? "projectCapture"
          : "estimate"
      )
    },
    [projects]
  )

  const updateCurrent = useCallback(
    (patch: Partial<Project>) => {
      setCurrent((curr) =>
        curr ? { ...curr, ...patch } : curr
      )
    },
    []
  )

  const saveCurrent = useCallback(() => {
    setCurrent((curr) => {
      if (!curr) return curr

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === curr.id)

        if (exists) {
          return prev.map((p) =>
            p.id === curr.id ? curr : p
          )
        }

        return [curr, ...prev]
      })

      return curr
    })
  }, [])

  const totals = useMemo<Totals>(() => {
    if (!current) {
      return {
        materials: 0,
        labor: 0,
        subtotal: 0,
        withProfit: 0,
        tax: 0,
        total: 0,
      }
    }

    return computeTotals(
      current.lineItems,
      current.estimate
    )
  }, [current])

  const money = useCallback(
    (value: number) =>
      new Intl.NumberFormat(
        lang === "es" ? "es-US" : "en-US",
        {
          style: "currency",
          currency: business.currency || "USD",
        }
      ).format(value || 0),
    [lang, business.currency]
  )

  const value: Ctx = {
    lang,
    setLang,
    t,

    screen,
    go,

    business,
    setBusiness,

    projects,
    current,

    startProject,
    openProject,
    updateCurrent,
    saveCurrent,

    totals,
    money,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)

  if (!ctx) {
    throw new Error(
      "useApp must be used within AppProvider"
    )
  }

  return ctx
}
