import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button, Image, Tag, Typography } from 'antd'

import channelLogin from '@/const/channel/login'
import { loadSDK } from '@/const/channel/sdk'

import appHelper from '@/utils/appHelper'

import useInfo from '@/views/desktop/sign/login/useInfo'

import './index.less'

const Component = () => {
  const { t } = appHelper.lang.use()

  const [search] = useSearchParams()
  const qKey = search.get('key') || ''

  const [error, setError] = useState({ title: '', content: '' })

  const [loading, setLoading] = useState(false)

  const { info } = useInfo({
    key: qKey,
    onBefore: async () => {
      await loadSDK()
    },
    onError: (title, content) => {
      setError({ title, content })
    },
  })

  return (
    <div id="mobile-page-sign-login">
      {error.title ? (
        <div className="error">
          <div className="title">{error.title}</div>
          <div className="content">
            <div>{error.content}</div>
          </div>
        </div>
      ) : (
        <>
          {info && qKey ? (
            <div className="view">
              <div className="title">{t('获取账户信息，请勿扫描他人二维码')}</div>

              <div className="app">
                <div className="logo">
                  <Image className="i" src={info.app.picture} preview={false}></Image>
                </div>

                <div className="title">
                  <div className="t">{info.app.name}</div>
                  <Tag>{info.app.entry}</Tag>
                </div>

                <Typography.Paragraph ellipsis={{ rows: 3 }} className="content">
                  {info.app.desc}
                </Typography.Paragraph>
              </div>

              <div className="confirm">
                <Button
                  className="btn"
                  loading={loading}
                  onClick={() => channelLogin.sdk({ key: qKey, info }, { before: () => setLoading(true), after: () => setLoading(false) })}
                >
                  {t('确认授权')}
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  )
}

export default Component
