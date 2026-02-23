import { Navigate } from 'react-router'

export default [
  {
    path: '/',
    element: <Navigate to="/admin/app" replace />,
  },
]
