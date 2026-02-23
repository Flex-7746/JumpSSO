import { useEffect } from 'react'
import { useRoutes, useNavigate, useLocation, BrowserRouter } from 'react-router'
import { useDispatch } from 'react-redux'

import appHelper from '@/utils/appHelper'
import getRoute from './utils/getRoute'
import getRouteTree from './utils/getRouteTree'

import routes from './routes'

const Routes = () => {
  const { t } = appHelper.lang.use()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    appHelper.save({ dispatch })
  }, [])

  useEffect(() => {
    const route = getRoute(location.pathname)
    const routeTree = getRouteTree(route)

    appHelper.save({ navigate, location, route, routeTree })

    route?.meta?.title && (document.title = t(route?.meta?.title))
  }, [location])

  return useRoutes(routes)
}

const Router = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes />
  </BrowserRouter>
)

export default Router
