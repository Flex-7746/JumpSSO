import type { RouteModel } from '../model'

export default function getRoutes(pages: Record<string, { default: RouteModel | RouteModel[] }>) {
  return Object.values(pages)
    .map((page) => {
      const v = page.default
      return v === null || v === undefined ? [] : Array.isArray(v) ? v : [v]
    })
    .flat()
}
