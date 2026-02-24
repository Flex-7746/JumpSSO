import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button, Card, Form, Image, Input, Tag, Typography } from 'antd'
import QRCode from 'react-qr-code'

import { apiBase as api } from '@/api'

import channelItems from '@/const/channel/items'
import channelLogin from '@/const/channel/login'

import appHelper from '@/utils/appHelper'
import { H, W } from '@/utils/env'

import useInfo, { type InfoModel } from './useInfo'

import './index.less'

interface UserModel {
  username: string
  password: string
}

const openWindow: { value?: Window } = {}

const Component = () => {
  const { t } = appHelper.lang.use()

  const [search] = useSearchParams()
  const qKey = search.get('key') || ''

  const [form] = Form.useForm<UserModel>()

  const [loading, setLoading] = useState(false)

  const { info } = useInfo({
    key: qKey,
    onAfter: () => {
      const status = async () => {
        const link = await api.get<string>('/server/status', { key: qKey }, { noMsg: true })
        if (link) {
          openWindow.value && openWindow.value.close() && (openWindow.value = undefined)

          window.location.replace(link)
        } else {
          setTimeout(status, 1000)
        }
      }

      status()
    },
    onError: (title, content) => {
      appHelper.modal?.error({
        title,
        content,
        okText: t('返回'),
        onOk: () => appHelper.navigate?.(-1),
      })
    },
  })

  const accountAuth = useMemo(() => info?.account !== false, [info])

  const qrcodeAuth = useMemo(
    () =>
      channelItems
        .filter((i) => i.qrcode)
        .map((i) => (info && info[i.config.replace('_config', '') as keyof InfoModel] ? t(i.label) : ''))
        .filter((i) => !!i)
        .join('、'),
    [t, info],
  )

  const jumpAuth = useMemo(() => {
    return channelItems
      .filter((i) => i.jump && info && info[i.config.replace('_config', '') as keyof InfoModel])
      .map((i) => (
        <Button
          key={i.config}
          onClick={() => {
            const width = 500
            const height = H * 0.8
            const left = (W - width) / 2
            const top = (H - height) / 2
            if (info && i.jump) {
              const url = i.jump(info, { key: qKey })
              if (url) {
                openWindow.value = window.open(url, '_blank', `popup,width=${width},height=${height},left=${left},top=${top}`) || undefined
              }
            }
          }}
        >
          {t('xxxx授权', { replace: { xxxx: t(i.label) } })}
        </Button>
      ))
  }, [t, info, qKey])

  const appView = useMemo(() => {
    if (!info) {
      return <></>
    }

    return (
      <div className="app-view" style={{ alignItems: info.app.desc ? 'flex-start' : 'center' }}>
        <Image className="logo" src={info.app.picture} width={56} height={56}></Image>

        <div className="text">
          <div className="t1">
            <div className="t">{info.app.name}</div>
            <Tag>{info.app.entry}</Tag>
          </div>
          <Typography.Paragraph ellipsis={{ rows: 3 }} className="t2">
            {info.app.desc}
          </Typography.Paragraph>
        </div>
      </div>
    )
  }, [info])

  const authView = useMemo(() => {
    if (qrcodeAuth || jumpAuth.length) {
      return (
        <div className="auth-view">
          {qrcodeAuth ? (
            <>
              <QRCode className="img" value={window.location.href} size={180} />

              <div className="text">{t('支持xxxx扫码登录', { replace: { xxxx: qrcodeAuth } })}</div>
            </>
          ) : (
            <></>
          )}

          {jumpAuth.length ? (
            <>
              <div className="btn">{jumpAuth}</div>
            </>
          ) : (
            <></>
          )}
        </div>
      )
    } else {
      return <></>
    }
  }, [qrcodeAuth, jumpAuth])

  return info && qKey ? (
    <div id="page-sign-login" className={accountAuth && qrcodeAuth ? '' : 'mini'}>
      <Card title={t('应用授权')} extra={<Tag color="blue">JumpSSO</Tag>}>
        {accountAuth ? (
          <div className="content-view">
            <div style={{ flex: 1 }}>
              {appView}

              <Form
                form={form}
                labelCol={{ flex: '50px' }}
                disabled={loading}
                onFinish={(v) =>
                  channelLogin.account({ key: qKey, ...v }, { before: () => setLoading(true), after: () => setLoading(false) })
                }
              >
                <Form.Item label={t('账户')} name="username" rules={[{ required: true, message: t('请输入邮箱或手机号') }]}>
                  <Input placeholder={t('请输入邮箱或手机号')} />
                </Form.Item>

                <Form.Item label={t('密码')} name="password" rules={[{ required: true, message: t('请输入密码') }]}>
                  <Input.Password placeholder={t('请输入密码')} />
                </Form.Item>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '50px' }}>
                  <Button type="primary" htmlType="submit">
                    {t('登录')}
                  </Button>

                  <Button htmlType="submit" onClick={() => appHelper.navigate?.(-1)}>
                    {t('取消')}
                  </Button>
                </div>
              </Form>

              {!qrcodeAuth && jumpAuth.length ? (
                <div style={{ borderTop: 'solid 1px #eee', marginTop: '24px', paddingTop: '24px' }}>{authView}</div>
              ) : (
                <></>
              )}
            </div>

            {qrcodeAuth ? <div style={{ borderLeft: 'solid 1px #eee', paddingLeft: '24px' }}>{authView}</div> : <></>}
          </div>
        ) : qrcodeAuth || jumpAuth.length ? (
          <>
            {appView}

            {authView}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>{t('暂无登录方式')}</div>
        )}
      </Card>
    </div>
  ) : (
    <></>
  )
}

export default Component
