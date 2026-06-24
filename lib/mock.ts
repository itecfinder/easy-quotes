import type {
  AIAnalysis,
  LineItem,
  PriceRow,
  ProjectTypeKey,
  StoreKey,
  StorePrice,
} from "./types"

export const uid = () => Math.random().toString(36).slice(2, 10)

type Template = {
  analysis: AIAnalysis
  materials: { description: string; qty: number; unit: string; basePrice: number }[]
  labor: { description: string; qty: number; unit: string; rate: number }[]
}

// Approximate, demo-only takeoffs per project type.
const templates: Record<ProjectTypeKey, Template> = {
  roofing: {
    analysis: {
      surfaces: [
        { label: "Asphalt shingle roof", area: 1800, unit: "sq ft", confidence: 0.86 },
        { label: "Ridge line", area: 60, unit: "lin ft", confidence: 0.78 },
      ],
      damage: [
        { label: "Missing shingles (NE slope)", severity: "medium" },
        { label: "Worn flashing around chimney", severity: "high" },
      ],
      scope: ["Tear off existing layer", "Install underlayment", "Install shingles", "Replace flashing"],
      followUps: ["How many stories is the home?", "Is there more than one existing layer?"],
    },
    materials: [
      { description: "Architectural shingles (bundle)", qty: 54, unit: "bundle", basePrice: 38 },
      { description: "Synthetic underlayment (roll)", qty: 4, unit: "roll", basePrice: 95 },
      { description: "Roofing nails (box)", qty: 6, unit: "box", basePrice: 28 },
      { description: "Drip edge", qty: 160, unit: "lin ft", basePrice: 2.1 },
      { description: "Pipe boot / flashing kit", qty: 3, unit: "each", basePrice: 18 },
    ],
    labor: [{ description: "Roof installation crew", qty: 36, unit: "hr", rate: 65 }],
  },
  drywall: {
    analysis: {
      surfaces: [{ label: "Interior walls", area: 1200, unit: "sq ft", confidence: 0.82 }],
      damage: [{ label: "Water stain near ceiling", severity: "low" }],
      scope: ["Hang drywall", "Tape & mud", "Sand", "Prime"],
      followUps: ["Standard or moisture-resistant board?", "Ceiling included?"],
    },
    materials: [
      { description: '1/2" drywall sheet 4x8', qty: 38, unit: "sheet", basePrice: 14 },
      { description: "Joint compound (bucket)", qty: 4, unit: "bucket", basePrice: 16 },
      { description: "Drywall tape (roll)", qty: 6, unit: "roll", basePrice: 7 },
      { description: "Drywall screws (lb)", qty: 8, unit: "lb", basePrice: 6 },
    ],
    labor: [{ description: "Hang, tape & finish", qty: 28, unit: "hr", rate: 55 }],
  },
  painting: {
    analysis: {
      surfaces: [{ label: "Interior walls & ceilings", area: 2100, unit: "sq ft", confidence: 0.88 }],
      damage: [{ label: "Minor nail pops", severity: "low" }],
      scope: ["Patch & sand", "Prime", "Two coats finish"],
      followUps: ["One or two color scheme?", "Trim and doors included?"],
    },
    materials: [
      { description: "Interior paint (gal)", qty: 12, unit: "gal", basePrice: 34 },
      { description: "Primer (gal)", qty: 5, unit: "gal", basePrice: 22 },
      { description: "Roller & tray kit", qty: 4, unit: "kit", basePrice: 12 },
      { description: "Painter's tape (roll)", qty: 8, unit: "roll", basePrice: 5 },
    ],
    labor: [{ description: "Surface prep & painting", qty: 26, unit: "hr", rate: 48 }],
  },
  flooring: {
    analysis: {
      surfaces: [{ label: "Floor area", area: 850, unit: "sq ft", confidence: 0.84 }],
      damage: [{ label: "Uneven subfloor (kitchen)", severity: "medium" }],
      scope: ["Remove old flooring", "Level subfloor", "Install flooring", "Trim & transitions"],
      followUps: ["Tile, wood, or carpet?", "Is subfloor leveling needed?"],
    },
    materials: [
      { description: "LVP flooring (sq ft)", qty: 935, unit: "sq ft", basePrice: 2.6 },
      { description: "Underlayment (roll)", qty: 3, unit: "roll", basePrice: 32 },
      { description: "Transition strips", qty: 6, unit: "each", basePrice: 14 },
      { description: "Trowel adhesive (gal)", qty: 4, unit: "gal", basePrice: 26 },
    ],
    labor: [{ description: "Floor installation", qty: 22, unit: "hr", rate: 52 }],
  },
  siding: {
    analysis: {
      surfaces: [{ label: "Exterior wall area", area: 1600, unit: "sq ft", confidence: 0.8 }],
      damage: [{ label: "Cracked panels (south wall)", severity: "medium" }],
      scope: ["Remove old siding", "House wrap", "Install siding", "Trim & caulk"],
      followUps: ["Vinyl or fiber cement?", "Replace house wrap?"],
    },
    materials: [
      { description: "Vinyl siding (square)", qty: 18, unit: "square", basePrice: 145 },
      { description: "House wrap (roll)", qty: 2, unit: "roll", basePrice: 165 },
      { description: "J-channel trim", qty: 220, unit: "lin ft", basePrice: 1.4 },
      { description: "Exterior caulk (tube)", qty: 10, unit: "tube", basePrice: 6 },
    ],
    labor: [{ description: "Siding installation", qty: 40, unit: "hr", rate: 58 }],
  },
  insulation: {
    analysis: {
      surfaces: [{ label: "Attic floor", area: 1100, unit: "sq ft", confidence: 0.83 }],
      damage: [{ label: "Compressed existing insulation", severity: "low" }],
      scope: ["Air sealing", "Install batts / blown-in", "Baffles at eaves"],
      followUps: ["Target R-value?", "Batt or blown-in?"],
    },
    materials: [
      { description: "R-38 batts (bag)", qty: 16, unit: "bag", basePrice: 48 },
      { description: "Air sealing foam (can)", qty: 6, unit: "can", basePrice: 8 },
      { description: "Attic baffles", qty: 24, unit: "each", basePrice: 1.8 },
    ],
    labor: [{ description: "Insulation install", qty: 14, unit: "hr", rate: 46 }],
  },
  driveway: {
    analysis: {
      surfaces: [{ label: "Concrete driveway", area: 620, unit: "sq ft", confidence: 0.81 }],
      damage: [{ label: "Surface cracking", severity: "medium" }],
      scope: ["Demo & haul", "Grade & base", "Form & pour", "Finish & cure"],
      followUps: ["Concrete or asphalt?", "Demo of existing required?"],
    },
    materials: [
      { description: "Concrete (cu yd)", qty: 12, unit: "cu yd", basePrice: 145 },
      { description: "Rebar (stick)", qty: 40, unit: "stick", basePrice: 9 },
      { description: "Gravel base (ton)", qty: 8, unit: "ton", basePrice: 32 },
      { description: "Expansion joint", qty: 60, unit: "lin ft", basePrice: 1.2 },
    ],
    labor: [{ description: "Demo, form, pour & finish", qty: 32, unit: "hr", rate: 60 }],
  },
  kitchenBath: {
    analysis: {
      surfaces: [
        { label: "Cabinet run", area: 24, unit: "lin ft", confidence: 0.79 },
        { label: "Tile area", area: 180, unit: "sq ft", confidence: 0.77 },
      ],
      damage: [{ label: "Outdated plumbing fixtures", severity: "low" }],
      scope: ["Demo", "Rough plumbing", "Cabinets & counters", "Tile & fixtures"],
      followUps: ["Moving any plumbing or electrical?", "Countertop material?"],
    },
    materials: [
      { description: "Stock cabinets (lin ft)", qty: 24, unit: "lin ft", basePrice: 210 },
      { description: "Quartz countertop (sq ft)", qty: 42, unit: "sq ft", basePrice: 58 },
      { description: "Wall tile (sq ft)", qty: 198, unit: "sq ft", basePrice: 4.2 },
      { description: "Fixtures package", qty: 1, unit: "set", basePrice: 680 },
    ],
    labor: [{ description: "Remodel crew", qty: 60, unit: "hr", rate: 62 }],
  },
  homeRemodel: {
    analysis: {
      surfaces: [{ label: "Living area floor", area: 1400, unit: "sq ft", confidence: 0.75 }],
      damage: [{ label: "Mixed scope — see notes", severity: "medium" }],
      scope: ["Demo", "Framing adjustments", "Finishes", "Paint & trim"],
      followUps: ["Which rooms are included?", "Structural changes planned?"],
    },
    materials: [
      { description: "Framing lumber (2x4)", qty: 80, unit: "each", basePrice: 4.2 },
      { description: "Drywall sheet 4x8", qty: 60, unit: "sheet", basePrice: 14 },
      { description: "Interior paint (gal)", qty: 16, unit: "gal", basePrice: 34 },
      { description: "Trim (lin ft)", qty: 320, unit: "lin ft", basePrice: 2.3 },
    ],
    labor: [{ description: "General remodel crew", qty: 90, unit: "hr", rate: 60 }],
  },
}

export function generateAnalysis(type: ProjectTypeKey): AIAnalysis {
  return templates[type].analysis
}

export function generateLineItems(type: ProjectTypeKey): LineItem[] {
  const t = templates[type]
  const materials: LineItem[] = t.materials.map((m) => ({
    id: uid(),
    type: "material",
    description: m.description,
    qty: m.qty,
    unit: m.unit,
    unitPrice: m.basePrice,
    source: "ai",
  }))
  const labor: LineItem[] = t.labor.map((l) => ({
    id: uid(),
    type: "labor",
    description: l.description,
    qty: l.qty,
    unit: l.unit,
    unitPrice: l.rate,
    source: "ai",
  }))
  return [...materials, ...labor]
}

const allStores: StoreKey[] = ["homeDepot", "lowes", "menards", "abcSupply", "lumber84"]

// Deterministic-ish multipliers so comparisons feel real but vary by store.
const storeFactor: Record<StoreKey, number> = {
  homeDepot: 1.0,
  lowes: 1.04,
  menards: 0.96,
  abcSupply: 1.08,
  lumber84: 0.99,
}

export function generatePriceComparison(materials: LineItem[]): PriceRow[] {
  return materials
    .filter((m) => m.type === "material")
    .map((m) => {
      const prices: StorePrice[] = allStores.map((store, i) => {
        const jitter = ((m.id.charCodeAt(0) + i * 7) % 9) / 100
        const unitPrice = +(m.unitPrice * (storeFactor[store] + jitter - 0.04)).toFixed(2)
        const inStock = !((m.id.charCodeAt(1) + i) % 6 === 0) // ~1 in 6 out of stock
        const promo = (m.id.charCodeAt(2) + i) % 7 === 0 ? "Save 10%" : undefined
        return { store, unitPrice, inStock, promo }
      })
      const inStockPrices = prices.filter((p) => p.inStock)
      const cheapest = (inStockPrices.length ? inStockPrices : prices).reduce((a, b) =>
        a.unitPrice <= b.unitPrice ? a : b,
      ).store
      return {
        materialId: m.id,
        description: m.description,
        unit: m.unit,
        prices,
        cheapest,
      }
    })
}

