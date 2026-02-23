import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { message as messageApi, notification as notificationApi, Modal as modalApi } from 'antd'

import AntDesign from '@/lib/antd'

import Router from '@/router'
import { store, persistor } from '@/redux'

import appHelper from '@/utils/appHelper'

import '@/style/index.less'

const App = () => {
  const { t, change } = appHelper.lang.use()

  const [message, messageContext] = messageApi.useMessage()
  const [notification, notificationContext] = notificationApi.useNotification()
  const [modal, contextContext] = modalApi.useModal()

  useEffect(() => {
    // 缓存工具、切换语言
    appHelper.lang.t = t
    change(store.getState().global.lang)

    // 全局工具
    appHelper.save({ message, notification, modal })
  }, [])

  return (
    <AntDesign>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>

      {messageContext}

      {notificationContext}

      {contextContext}
    </AntDesign>
  )
}

export default App
