import React from 'react'

import lazyLoad from '@/router/utils/lazyLoad'

export default [
  {
    path: '/admin/app',
    element: lazyLoad(React.lazy(() => import('./app'))),
    meta: { title: '应用' },
  },
  {
    path: '/admin/user',
    element: lazyLoad(React.lazy(() => import('./user'))),
    meta: { title: '用户' },
  },
  {
    path: '/admin/config',
    element: lazyLoad(React.lazy(() => import('./config'))),
    meta: { title: '配置' },
  },
]
