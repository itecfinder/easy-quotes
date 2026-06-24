"use client"

import { useRef } from "react"
import { Copy, Mail, Save, Share2, Upload } from "lucide-react"
import { toast } from "sonner"
import { projectTypeLabels } from "@/lib/i18n"
import { useApp } from "@/lib/store"
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
import { ScreenHeader } from "./parts"

export function InvoiceBuilder() {
  const { t, lang, current, updateCurrent, saveCurrent, totals, money, business, setBusiness, go } =
    useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  if (!current) return null

  const invoiceNo =
    current.invoiceNumber ?? `INV-${new Date().getFullYear()}-${current.id.slice(0, 4).toUpperCase()}`

  const materials = current.lineItems.filter((i) => i.type === "material")
  const labor = current.lineItems.filter((i) => i.type === "labor")

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setBusiness({ ...business, logoUrl: url })
    }
  }

  const finalize = (status: "invoiced" | "sent") => {
    updateCurrent({ invoiceNumber: invoiceNo, status })
    saveCurrent()
  }

  return (
    <div>
      <ScreenHeader title={t("invoice")} step={{ current: 4, total: 4 }} back="estimate" />

      <div className="space-y-4 px-4 pt-4">
        {/* Logo + business */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted"
            >
              {business.logoUrl ? (
                <img src={business.logoUrl || "/placeholder.svg"} alt="logo" className="size-full object-contain" />
              ) : (
                <Upload className="size-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1">
              <Label className="text-xs">{t("businessLogo")}</Label>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="mt-1 h-8">
                <Upload className="size-3.5" />
                {t("uploadLogo")}
              </Button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onLogo} />
          </div>
          <Input
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
            placeholder={t("businessName")}
            className="mt-3 h-10 font-semibold"
          />
        </div>

        {/* Invoice preview */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div>
              {business.logoUrl && (
                <img src={business.logoUrl || "/placeholder.svg"} alt="logo" className="mb-2 h-8 object-contain" />
              )}
              <p className="text-base font-bold text-foreground">
                {business.name || t("businessName")}
              </p>
              <p className="text-xs text-muted-foreground">{t("from")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("invoiceNo")}</p>
              <p className="text-sm font-semibold text-foreground">{invoiceNo}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("date")}</p>
              <p className="text-sm text-foreground">
                {new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US")}
              </p>
            </div>
          </div>

          <div className="my-3 h-px bg-border" />

          <p className="text-xs font-semibold uppercase text-muted-foreground">{t("billTo")}</p>
          <p className="text-sm font-medium text-foreground">{current.customer.name || "—"}</p>
          <p className="text-xs text-muted-foreground">{current.customer.address}</p>
          <p className="text-xs text-muted-foreground">{current.customer.email}</p>
          {current.type && (
            <p className="mt-1 text-xs text-muted-foreground">{projectTypeLabels[current.type][lang]}</p>
          )}

          <div className="my-3 h-px bg-border" />

          {/* Breakdown */}
          <Group title={t("materials")} rows={materials.map((m) => [m.description, money(m.qty * m.unitPrice)])} />
          <Group title={t("labor")} rows={labor.map((l) => [l.description, money(l.qty * l.unitPrice)])} />

          <div className="my-2 h-px bg-border" />
          <PreviewRow label={t("subtotal")} value={money(totals.subtotal)} />
          <PreviewRow label={t("tax")} value={money(totals.tax)} />
          <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
            <span className="font-bold text-secondary-foreground">{t("total")}</span>
            <span className="text-lg font-bold text-primary">{money(totals.total)}</span>
          </div>
        </div>

        {/* Payment terms */}
        <div className="space-y-1.5">
          <Label className="text-sm">{t("paymentTerms")}</Label>
          <Select
            value={current.paymentTerms}
            onValueChange={(v) => v && updateCurrent({ paymentTerms: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Due on receipt">Due on receipt / Pago inmediato</SelectItem>
              <SelectItem value="Net 15">Net 15</SelectItem>
              <SelectItem value="Net 30">Net 30</SelectItem>
              <SelectItem value="50% deposit">50% deposit / 50% anticipo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            onClick={() => {
              finalize("sent")
              toast.success(t("emailSent"))
            }}
            className="h-12 text-sm font-semibold"
          >
            <Mail className="size-4" />
            {t("sendInvoice")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              finalize("invoiced")
              navigator.clipboard?.writeText(`${invoiceNo} — ${money(totals.total)}`)
              toast.success(t("copied"))
            }}
            className="h-12 text-sm font-semibold"
          >
            <Copy className="size-4" />
            {t("copyInvoice")}
          </Button>
          <Button variant="outline" onClick={() => toast.success(t("shareInvoice"))} className="h-12 text-sm font-semibold">
            <Share2 className="size-4" />
            {t("shareInvoice")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              finalize("invoiced")
              go("history")
              toast.success(t("projectSaved"))
            }}
            className="h-12 text-sm font-semibold"
          >
            <Save className="size-4" />
            {t("saveInvoice")}
          </Button>
        </div>
        {/* Business Account CTA */}
<a
  href="https://www.itecfinder.com/checkout/trusted-expert"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 block"
>
  <div className="rounded-xl border border-border bg-card p-5 transition hover:bg-accent cursor-pointer">

    <h3 className="text-lg font-semibold">
      Free Estimate Complete
    </h3>

    <p className="mt-2 text-sm text-muted-foreground">
      Get unlimited estimates and more business opportunities with a Trusted Expert membership.
    </p>

    <p className="mt-4 font-medium text-primary">
      Learn More →
    </p>

  </div>
</a>
      </div>
    </div>
  )
}

function Group({ title, rows }: { title: string; rows: [string, string][] }) {
  if (rows.length === 0) return null
  return (
    <div className="mb-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      {rows.map(([label, value], i) => (
        <div key={i} className="flex items-center justify-between py-0.5 text-sm">
          <span className="truncate pr-2 text-foreground">{label || "—"}</span>
          <span className="shrink-0 font-medium text-foreground">{value}</span>
        </div>
      ))}
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
