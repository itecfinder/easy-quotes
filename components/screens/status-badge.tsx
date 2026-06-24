"use client"

import { useApp } from "@/lib/store"
import type { DictKey } from "@/lib/i18n"
import type { ProjectStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const map: Record<ProjectStatus, { key: DictKey; cls: string }> = {
  draft: { key: "statusDraft", cls: "bg-muted text-muted-foreground" },
  estimated: { key: "statusEstimated", cls: "bg-accent text-accent-foreground" },
  invoiced: { key: "statusInvoiced", cls: "bg-secondary text-secondary-foreground" },
  sent: { key: "statusSent", cls: "bg-primary text-primary-foreground" },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useApp()
  const s = map[status]
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", s.cls)}>
      {t(s.key)}
    </span>
  )
}
