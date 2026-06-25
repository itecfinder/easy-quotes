"use client"

import {
  CarFront,
  CookingPot,
  Frame,
  Grid3x3,
  House,
  Layers,
  PaintRoller,
  PanelsTopLeft,
  Plus,
  Triangle,
  type LucideIcon,
} from "lucide-react"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { computeTotals } from "@/lib/services/pricing"
import { projectTypeLabels } from "@/lib/i18n"
import type { ProjectTypeKey } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ✅ SAFE fallback (prevents build crash if file is broken)
const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className="text-xs px-2 py-1 rounded bg-muted">
      {status}
    </span>
  )
}

const typeIcons: Record<ProjectTypeKey, LucideIcon> = {
  kitchenBath: CookingPot,
  homeRemodel: House,
  flooring: Grid3x3,
  drywall: Frame,
  siding: PanelsTopLeft,
  painting: PaintRoller,
  insulation: Layers,
  driveway: CarFront,
  roofing: Triangle,
}

const order: ProjectTypeKey[] = [
  "kitchenBath",
  "homeRemodel",
  "flooring",
  "drywall",
  "siding",
  "painting",
  "insulation",
  "driveway",
  "roofing",
]

export function Dashboard() {
  const { t, lang, startProject, projects, openProject, money, go } = useApp()

  const [identifier, setIdentifier] = useState("")

  const createProject = async (projectType?: ProjectTypeKey) => {
    if (!identifier.trim()) {
      alert("Please enter your email address")
      return
    }

    try {
      const response = await fetch("/api/verify-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier.trim() }),
      })

      const result = await response.json()

      // NEW LEAD
      if (result.access === "lead") {
        const key = `lead_estimate_${identifier.trim()}`
        const used = localStorage.getItem(key)

        if (used) {
          window.location.href = "https://www.itecfinder.com/join"
          return
        }

        localStorage.setItem(key, "true")
        localStorage.setItem("pending_email", identifier.trim())
        localStorage.setItem("pending_project_type", projectType ?? "")

        go("settings")
        return
      }

      // PAID
      if (result.access === "paid") {
        const profile = localStorage.getItem(
          `business_profile_${identifier.trim()}`
        )

        if (!profile) {
          localStorage.setItem("pending_email", identifier.trim())
          localStorage.setItem("pending_project_type", projectType ?? "")
          go("settings")
          return
        }

        startProject(projectType ?? null)
        return
      }

      window.location.href = "https://www.itecfinder.com/join"
    } catch (error) {
      console.error(error)
      alert("Unable to verify account")
    }
  }

  return (
    <div className="space-y-6 px-4 pt-5">
      {/* HERO */}
      <div className="rounded-2xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-sm font-medium text-primary">{t("appName")}</p>

        <h1 className="mt-1 text-2xl font-bold">
          {t("tagline")}
        </h1>

        <Input
          placeholder="Email or Phone Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mt-4"
        />

        <Button
          onClick={() => createProject()}
          className="mt-4 w-full"
        >
          <Plus className="size-5" />
          {t("newProject")}
        </Button>
      </div>

      {/* QUICK START */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
          {t("quickStart")}
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {order.map((key) => {
            const Icon = typeIcons[key]

            return (
              <button
                key={key}
                onClick={() => createProject(key)}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border bg-card"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent">
                  <Icon className="size-5" />
                </span>

                <span className="text-[11px] font-medium">
                  {projectTypeLabels[key][lang]}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* RECENT */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
          {t("recentProjects")}
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
            {t("noProjects")}
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.slice(0, 4).map((p) => {
              const total = computeTotals(p.lineItems, p.estimate).total

              return (
                <li key={p.id}>
                  <button
                    onClick={() => openProject(p.id)}
                    className="flex w-full justify-between rounded-xl border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {p.customer.name || t("newProject")}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {p.type ? projectTypeLabels[p.type][lang] : "—"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{money(total)}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
