"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type AppState = {
  lang: string
  screen: string
}

type AppContextType = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    lang: "en",
    screen: "dashboard",
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
