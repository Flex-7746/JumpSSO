export interface MetaModel {
  key: string
  title: string
  parent?: string
  noHeader?: boolean
  noFooter?: boolean
}

export interface RouteModel {
  path: string
  element?: React.ReactNode
  meta?: MetaModel
}
