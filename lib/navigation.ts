import type { ScreenKey } from "@/lib/types"

type TransitionMap = {
  [K in ScreenKey]: ScreenKey[]
}

export const navigationMap: TransitionMap = {
  dashboard: ["settings", "history", "projectCapture"],

  settings: ["dashboard"],

  history: ["dashboard", "estimate", "projectCapture"],

  projectCapture: ["scanAnalysis", "estimate", "dashboard"],

  scanAnalysis: ["estimate", "projectCapture"],

  estimate: ["invoice", "dashboard"],

  invoice: ["dashboard"],
}
