import { createContext, useContext, ReactNode } from "react"

const AppContext = createContext<any>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={useApp()}>
      {children}
    </AppContext.Provider>
  )
}
