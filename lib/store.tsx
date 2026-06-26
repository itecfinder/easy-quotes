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
  saveCurrent: () => Promise<void>

  business: {
    name: string
    logoUrl: string
  }

  setBusiness: (
    b: { name: string; logoUrl: string }
  ) => void

  totals: any
}
const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({
  children,
}: {
  children: ReactNode
}) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] =
    useState<ScreenKey>("dashboard")

  const [projects, setProjects] = useState<Project[]>([])
  const [current, setCurrent] = useState<Project | null>(null)
  const [business, setBusiness] = useState({ name: "",  logoUrl: "",})
  const go = (s: ScreenKey) => setScreen(s)

  const t = (key: string) =>
    dict[key as keyof typeof dict]?.[lang] ?? key

  // LOAD PROJECTS
  useEffect(() => {
    try {
      const data = loadProjects()

      // protect older/corrupted projects
      const safe = (data || []).map((p: any) => ({
        notes: "",
        images: [],
        analysis: null,
        lineItems: [],
        status: "draft",

        ...p,

        customer: {
          name: "",
          phone: "",
          email: "",
          address: "",
          zip: "",
          ...(p.customer || {}),
        },
      }))

      setProjects(safe)
    } catch (error) {
      console.error("Failed loading projects", error)
      setProjects([])
    }
  }, [])

  // SAVE HELPER
  const persist = (next: Project[]) => {
    setProjects(next)

    try {
      saveProjects(next)
    } catch (error) {
      console.error("Failed saving projects", error)
    }
  }

  // CREATE PROJECT
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

      notes: "",

      images: [],

      analysis: null,

      lineItems: [],

      status: "draft",

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

    go("capture")
  }

  // OPEN PROJECT
  const openProject = (id: string) => {
    const project = projects.find(
      (p) => p.id === id
    )

    if (!project) return

    const safeProject = {
      notes: "",
      images: [],
      analysis: null,
      lineItems: [],
      status: "draft",

      ...project,

      customer: {
        name: "",
        phone: "",
        email: "",
        address: "",
        zip: "",
        ...(project.customer || {}),
      },
    }

    setCurrent(safeProject)

    go("estimate")
  }

  // UPDATE CURRENT
  const updateCurrent = (patch: any) => {
    setCurrent((prev: any) => {
      if (!prev) return prev

      const updated = {
        ...prev,
        ...patch,

        customer: {
          ...prev.customer,
          ...(patch.customer || {}),
        },
      }

      const next = projects.map((p) =>
        p.id === updated.id ? updated : p
      )

      persist(next)

      return updated
    })
  }

  // SAVE CURRENT
  const saveCurrent = async () => {
    if (!current) return

    try {
      const updatedProjects = projects.some(
        (p) => p.id === current.id
      )
        ? projects.map((p) =>
            p.id === current.id ? current : p
          )
        : [current, ...projects]

      persist(updatedProjects)

      const email =
        localStorage.getItem("pending_email") ||
        current.customer?.email ||
        "lead@unknown.com"

      await saveProject(current, email)

      console.log("Project saved successfully")
    } catch (error) {
      console.error("Save failed:", error)
    }
  }

  // TOTALS PLACEHOLDER
  const totals = {
    materials: 0,
    labor: 0,
    subtotal: 0,
    withProfit: 0,
    tax: 0,
    total: 0,
  }

  // MONEY FORMATTER
  const money = (n: number) =>
    new Intl.NumberFormat(
      lang === "es" ? "es-US" : "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(n)

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

    business,
    setBusiness,

    totals,
  }),
  [lang, screen, current, projects, business]
)
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
      "useApp must be used inside AppProvider"
    )
  }

  return ctx
}
