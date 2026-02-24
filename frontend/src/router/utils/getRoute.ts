import { privateRoutes, publicRoutes } from '../routes'

const path2reg = (v: string) => new RegExp(`^${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, '([^/]+)')}$`)

export default function getRoute(path: string) {
  return [...privateRoutes, ...publicRoutes].find((i) => path.match(path2reg(i.path)))
}
