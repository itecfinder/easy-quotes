import { Dashboard } from "@/components/screens/dashboard"
import { Settings } from "@/components/screens/settings"
import { History } from "@/components/screens/history"
import { InvoiceBuilder } from "@/components/screens/invoice-builder"
import { EstimateEditor } from "@/components/screens/estimate-editor"

export const screens = {
  dashboard: Dashboard,
  settings: Settings,
  history: History,
  invoice: InvoiceBuilder,
  estimate: EstimateEditor,
} as const

export type ScreenKey = keyof typeof screens
