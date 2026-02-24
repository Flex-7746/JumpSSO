import React from 'react'

import lazyLoad from '@/router/utils/lazyLoad'

import { SYS_PATH } from '@/config'

export default [
  {
    path: SYS_PATH.login,
    element: lazyLoad(React.lazy(() => import('./login'))),
  },
  {
    path: SYS_PATH.error,
    element: lazyLoad(React.lazy(() => import('./error'))),
  },
]
