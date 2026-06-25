import type { Project } from "@/lib/types"

const KEY = "estimator_projects"

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(projects))
}
