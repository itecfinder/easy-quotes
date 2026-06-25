"use client"

import { cn } from "@/lib/utils"

type Status =
  | "draft"
  | "in_progress"
  | "completed"
  | "archived"
  | string
  | undefined
  | null

interface Props {
  status?: Status
  className?: string
}

const statusConfig: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-yellow-100 text-yellow-700",
}

export function StatusBadge({ status, className }: Props) {
  const safeStatus = status ?? "draft"

  const styles = statusConfig[safeStatus] ?? "bg-gray-100 text-gray-700"

  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full capitalize",
        styles,
        className
      )}
    >
      {safeStatus.replace("_", " ")}
    </span>
  )
}
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
