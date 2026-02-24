import { ConfigProvider } from 'antd'

import appHelper from '@/utils/appHelper'

import { type ReactNode } from 'react'

const AntDesign = (props: { children?: ReactNode }) => {
  const { i18n } = appHelper.lang.use()

  return <ConfigProvider locale={appHelper.lang.target(i18n.language).antd}>{props.children}</ConfigProvider>
}

export default AntDesign
