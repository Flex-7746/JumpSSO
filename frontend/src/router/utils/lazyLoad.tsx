import { Suspense, type JSX, type LazyExoticComponent, type ReactNode } from 'react'

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: LazyExoticComponent<() => JSX.Element>): ReactNode => {
  return (
    <Suspense>
      <Comp />
    </Suspense>
  )
}

export default lazyLoad
