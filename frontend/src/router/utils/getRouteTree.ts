import { privateRoutes } from '../routes'

import type { RouteModel } from '../model'

/**
 * 获取路由树
 */
export default function getRouteTree(route?: RouteModel, prev?: RouteModel[]): RouteModel[] {
  const result = prev || []

  if (!route) {
    return result
  }
  const routes = privateRoutes.flat()

  const target = routes.find((i) => i.path === route.path)

  if (!target) {
    return result
  }

  result.unshift(target)

  const parent = target.meta?.parent

  return parent
    ? getRouteTree(
        routes.find((i) => i.path === parent),
        result,
      )
    : result
}
