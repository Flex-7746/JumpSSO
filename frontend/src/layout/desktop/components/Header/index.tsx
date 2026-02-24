import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Avatar, Dropdown, Tabs } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import api from '@/api'

import { store } from '@/redux'

import appHelper from '@/utils/appHelper'

import logoImg from '@/assets/logo.png'

import './index.less'

const Component = () => {
  const { t } = appHelper.lang.use()

  const location = useLocation()

  const user = useMemo(() => store.getState().user, [store])

  const menu = useMemo(
    () => [
      { key: 'app', label: t('应用'), path: '/admin/app', open: false },
      { key: 'user', label: t('用户'), path: '/admin/user', open: false },
      { key: 'config', label: t('配置'), path: '/admin/config', open: false },
    ],
    [t],
  )

  const action = useMemo(
    () => [
      {
        key: 'logout',
        label: t('退出登录'),
        onClick: () => {
          appHelper.modal?.confirm({
            title: t('提示'),
            icon: <ExclamationCircleOutlined />,
            content: t('确认退出登录？'),
            okText: t('确认'),
            cancelText: t('取消'),
            onOk: async () => {
              await api.post('/sign/logout')
              appHelper.message?.success('操作成功')
              appHelper.login()
            },
          })
        },
      },
    ],
    [],
  )

  const [view, setView] = useState('-')

  const onMenuClick = useCallback(
    (val: string) => {
      const target = menu.find((i) => i.key === val)
      if (target) {
        target.open ? window.open(target.path) : appHelper.navigate?.(target.path)
        setView(val)
      } else {
        appHelper.navigate?.('error?code=404')
      }
    },
    [menu],
  )

  useEffect(() => {
    setTimeout(() => {
      const root = appHelper.routeTree?.[0]?.path
      setView(menu.find((i) => i.path === root)?.key || '-')
    }, 0)
  }, [location])

  return (
    <div id="app-header">
      <div className="g-container">
        <div className="left">
          <div className="logo">
            <img className="i" src={logoImg} />
            <div className="t">JumpSSO</div>
          </div>
        </div>

        <div className="center">
          <Tabs className="menu" activeKey={view} items={menu} onTabClick={onMenuClick} />
        </div>

        <div className="right">
          <Dropdown placement="bottom" menu={{ items: action }} trigger={['click']}>
            <Avatar className="avatar" size={32} src={user.picture || undefined} style={user.picture ? {} : { backgroundColor: 'purple' }}>
              {user.name[0]}
            </Avatar>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default memo(Component)
