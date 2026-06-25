"use client"

import {
  useEffect,
  useRef,
  type ChangeEvent,
  useMemo,
} from "react"

import { Upload } from "lucide-react"
import { toast } from "sonner"

import { storeLabels } from "@/lib/i18n"
import { useApp } from "@/lib/store"
import type { Lang, StoreKey } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

// -----------------------------
// CONSTANTS
// -----------------------------
const storeOrder: StoreKey[] = [
  "homeDepot",
  "lowes",
  "menards",
  "abcSupply",
  "lumber84",
]

// -----------------------------
// SAFE FALLBACK (SSR PROTECTION)
// -----------------------------
const emptyBusiness = {
  name: "",
  category: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  zip_code: "",
  preferredStore: "homeDepot" as StoreKey,
  currency: "USD" as const,
  logoUrl: "",
}

// -----------------------------
// COMPONENT
// -----------------------------
export function Settings() {
  const { t, lang, setLang, business, setBusiness } = useApp()

  const fileRef = useRef<HTMLInputElement>(null)
  const prevUrl = useRef<string | null>(null)

  //  SSR-safe business (prevents prerender crashes)
  const safeBusiness = useMemo(() => {
    return {
      ...emptyBusiness,
      ...(business ?? {}),
    }
  }, [business])

  // -----------------------------
  // SAFE STATE UPDATE (ZUSTAND/CTX SAFE)
  // -----------------------------
  const updateBusiness = (patch: Partial<typeof safeBusiness>) => {
    setBusiness((prev: any) => ({
      ...(prev ?? emptyBusiness),
      ...patch,
    }))
  }

  // -----------------------------
  // CLEANUP OBJECT URL
  // -----------------------------
  useEffect(() => {
    return () => {
      if (prevUrl.current) {
        URL.revokeObjectURL(prevUrl.current)
      }
    }
  }, [])

  // -----------------------------
  // LOGO HANDLER
  // -----------------------------
  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)

    if (prevUrl.current) {
      URL.revokeObjectURL(prevUrl.current)
    }

    prevUrl.current = url
    updateBusiness({ logoUrl: url })

    // allow same file re-upload
    e.target.value = ""
  }

  // -----------------------------
  // FIELD UPDATER (TYPE SAFE)
  // -----------------------------
  const setField =
    <K extends keyof typeof safeBusiness>(key: K) =>
    (value: (typeof safeBusiness)[K]) => {
      updateBusiness({ [key]: value })
    }

  // -----------------------------
  // SELECT VALUE SAFETY
  // -----------------------------
  const preferredStoreValue = storeOrder.includes(
    safeBusiness.preferredStore
  )
    ? safeBusiness.preferredStore
    : "homeDepot"

  return (
    <div className="space-y-6 px-4 pt-5">
      <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
        {t("settings")}
      </h1>

      {/* LANGUAGE */}
      <Section title={t("language")}>
        <div className="flex gap-2">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                lang === l
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              )}
            >
              {l === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </Section>

      {/* BUSINESS */}
      <Section title={t("businessProfile")}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex size-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted"
          >
            {safeBusiness.logoUrl ? (
              <img
                src={safeBusiness.logoUrl}
                alt="logo"
                className="size-full object-contain"
              />
            ) : (
              <Upload className="size-5 text-muted-foreground" />
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="h-9"
          >
            <Upload className="size-4" />
            {t("uploadLogo")}
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onLogo}
          />
        </div>

        <LabeledInput
          label={t("businessName")}
          value={safeBusiness.name}
          onChange={setField("name")}
        />

        <LabeledInput
          label={t("businessType")}
          value={safeBusiness.category}
          onChange={setField("category")}
        />

        <LabeledInput
          label={t("phone")}
          value={safeBusiness.phone}
          onChange={setField("phone")}
        />

        <LabeledInput
          label={t("email")}
          value={safeBusiness.email}
          onChange={setField("email")}
        />

        <LabeledInput
          label={t("businessAddress")}
          value={safeBusiness.address}
          onChange={setField("address")}
        />

        <LabeledInput
          label={t("city")}
          value={safeBusiness.city}
          onChange={setField("city")}
        />

        <LabeledInput
          label={t("zipCode")}
          value={safeBusiness.zip_code}
          onChange={setField("zip_code")}
        />
      </Section>

      {/* DEFAULTS */}
      <Section title={t("defaults")}>
        <div className="space-y-1.5">
          <Label className="text-sm">{t("preferredStore")}</Label>

          <Select
            value={preferredStoreValue}
            onValueChange={(v) =>
              updateBusiness({ preferredStore: v as StoreKey })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {storeOrder.map((s) => (
                <SelectItem key={s} value={s}>
                  {storeLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">{t("currency")}</Label>

          <Select
            value={safeBusiness.currency}
            onValueChange={(v) =>
              updateBusiness({
                currency: v as typeof safeBusiness.currency,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="MXN">MXN ($)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Button
        onClick={() => toast.success(t("saved"))}
        className="h-12 w-full text-base font-semibold"
      >
        {t("save")}
      </Button>
    </div>
  )
}

// -----------------------------
// UI HELPERS
// -----------------------------
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-10"
      />
    </div>
  )
}
