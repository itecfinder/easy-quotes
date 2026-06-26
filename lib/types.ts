export type Lang = "en" | "es"
export type ScreenKey =
  | "access"
  | "dashboard"
  | "capture"
  | "scan"
  | "estimate"
  | "prices"
  | "invoice"
  | "history"
  | "settings"


export type ProjectTypeKey =
  | "kitchenBath"
  | "homeRemodel"
  | "flooring"
  | "drywall"
  | "siding"
  | "painting"
  | "insulation"
  | "driveway"
  | "roofing"

export type ScanMode = "roof" | "walls" | "floors" | "generic"

export type Customer = {
  name: string
  phone: string
  email: string
  address: string
  zip: string
}

export type ProjectImage = {
  id: string
  url: string
  scanMode: ScanMode
}

export type LineItemType = "material" | "labor"

export type StoreKey =
  | "homeDepot"
  | "lowes"
  | "menards"
  | "abcSupply"
  | "lumber84"

export type LineItem = {
  id: string
  type: LineItemType
  description: string
  qty: number
  unit: string
  unitPrice: number
  store?: StoreKey
  source: "ai" | "manual"
}

export type StorePrice = {
  store: StoreKey
  unitPrice: number
  inStock: boolean
  promo?: string
}

export type PriceRow = {
  materialId: string
  description: string
  unit: string
  prices: StorePrice[]
  cheapest: StoreKey
}

export type EstimateSettings = {
  laborRate: number
  wastePct: number
  profitPct: number
  taxPct: number
  discount: number
}

export type AIAnalysis = {
  surfaces: { label: string; area: number; unit: string; confidence: number }[]
  damage: { label: string; severity: "low" | "medium" | "high" }[]
  scope: string[]
  followUps: string[]
}

export type ProjectStatus = "draft" | "estimated" | "invoiced" | "sent"

export type Project = {
  id: string
  createdAt: number
  status: ProjectStatus
  type: ProjectTypeKey | null
  customer: Customer
  notes: string
  images: ProjectImage[]
  analysis: AIAnalysis | null
  estimate: EstimateSettings
  lineItems: LineItem[]
  paymentTerms: string
  invoiceNumber: string | null
}

export type BusinessProfile = {
  name: string
  phone: string
  email: string
  address: string
  logoUrl: string | null
  preferredStore: StoreKey | null
  currency: string
}

export type AppContextType = {
  lang: Lang
  setLang: (l: Lang) => void

  screen: ScreenKey
  go: (s: ScreenKey) => void

  t: (key: string) => string

  projects: Project[]

  current: Project | null
  setCurrent: (p: Project | null) => void

  createProject: (type: ProjectTypeKey | null) => Project
  startProject: (type: ProjectTypeKey | null) => void
  openProject: (id: string) => void

  money: (n: number) => string
}
