import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Button, Result } from 'antd'

import appHelper from '@/utils/appHelper'

const Component = () => {
  const { t } = appHelper.lang.use()

  const [search] = useSearchParams()

  const state = useMemo(() => search.get('state') || '', [search])

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      {state === 'success' ? (
        <Result title={t('JumpSSO 已登出')} subTitle={t('其他接入应用将需要重新进行用户登录')} status="success" />
      ) : (
        <Result
          title={t('JumpSSO 用户登出')}
          subTitle={t('登出 JumpSSO，其他接入应用将需要重新进行用户登录')}
          status="warning"
          extra={
            <Button
              type="primary"
              danger
              onClick={() => {
                window.location.replace(`${import.meta.env.VITE_APP_API_HOST}/oidc/session/end?confirm=1`)
              }}
            >
              {t('确认登出')}
            </Button>
          }
        />
      )}
    </div>
  )
}

export default Component
