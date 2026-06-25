"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"
import type { ScreenKey } from "./types"

type Lang = "en" | "es"

type AppContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  screen: ScreenKey
  go: (s: ScreenKey) => void
  t: (key: string) => string
}

const AppContext = createContext<AppContextType | null>(null)

const dict: Record<Lang, Record<string, string>> = {
  en: {
    appName: "Easy Quotes",
    language: "Language",
    navHome: "Home",
    navProjects: "Projects",
    navSettings: "Settings",
  },
  es: {
    appName: "Cotizaciones",
    language: "Idioma",
    navHome: "Inicio",
    navProjects: "Proyectos",
    navSettings: "Ajustes",
  },
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  const go = (s: ScreenKey) => setScreen(s)

  const t = (key: string) => {
    return dict[lang]?.[key] ?? key
  }

  const value = useMemo(
    () => ({
      lang,
      setLang,
      screen,
      go,
      t,
    }),
    [lang, screen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider")
  }
  return ctx
}
