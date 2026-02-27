import React from 'react'

import lazyLoad from '@/router/utils/lazyLoad'

export default [
  {
    path: '/sign/login',
    element: lazyLoad(React.lazy(() => import('./login'))),
  },
  {
    path: '/sign/callback/:type/:key',
    element: lazyLoad(React.lazy(() => import('./callback'))),
  },
  {
    path: '/sign/logout',
    element: lazyLoad(React.lazy(() => import('./logout'))),
  },
]
