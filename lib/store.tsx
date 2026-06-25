"use client"

import { createContext, useContext, useState, ReactNode } from "react"

const AppContext = createContext<any>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
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
