import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router'
import { Spin, Watermark } from 'antd'
import dayjs from 'dayjs'

import appHelper from '@/utils/appHelper'

import api from '@/api'

import { store, useSelector } from '@/redux'
import { update as userUpdate } from '@/redux/reducer/user'

// import Auth from "./components/Auth";
// import Logo from "./components/Logo";
// import Nav from "./components/Nav";
import Header from './components/Header'
// import Tabs from "./components/Tabs";
// import Footer from "./components/Footer";

import type { StateModel as UserModel } from '@/redux/reducer/user'

import './style/index.less'

const Component = () => {
  const globalStore = useSelector((state) => state.global)

  const [initialized, setInitialized] = useState(false)

  const loadData = useCallback(async () => {
    const user = await api.get<UserModel>('/sign/info')

    store.dispatch(userUpdate(user))

    setInitialized(true)
  }, [])

  /**
   * App 数据初始化
   */
  useEffect(() => {
    globalStore.token ? loadData() : appHelper.login()
  }, [])

  return initialized ? (
    <Watermark
      content={`${store.getState().user.name} ${dayjs().format('YYYY-MM-DD')}`}
      style={{ height: '100%' }}
      font={{ color: 'rgba(0,0,0,0.06)' }}
    >
      <div id="app-main">
        <Header />

        <Outlet />
      </div>
    </Watermark>
  ) : (
    <div id="app-loading">
      <Spin />
    </div>
  )
}

export default Component
