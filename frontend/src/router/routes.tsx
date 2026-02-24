import React from 'react'
import { Navigate } from 'react-router'

import { SYS_PATH } from '@/config'

import { IS_MOBILE } from '@/utils/env'

import getRoutes from './utils/getRoutes'
import lazyLoad from './utils/lazyLoad'

// 需鉴权的页面
export const privateRoutes = getRoutes(
  IS_MOBILE
    ? import.meta.glob('@/views/mobile/**/*/routes.tsx', { eager: true })
    : import.meta.glob('@/views/desktop/**/*/routes.tsx', { eager: true }),
)

// 无需鉴权的页面
export const publicRoutes = getRoutes(
  IS_MOBILE
    ? import.meta.glob('@/views/mobile/**/*/routes.public.tsx', { eager: true })
    : import.meta.glob('@/views/desktop/**/*/routes.public.tsx', { eager: true }),
)

export default [
  ...publicRoutes,

  { element: lazyLoad(React.lazy(() => (IS_MOBILE ? import('@/layout/mobile') : import('@/layout/desktop')))), children: privateRoutes },

  { path: '*', element: <Navigate to={`${SYS_PATH.error}?code=404`} replace /> },
]
