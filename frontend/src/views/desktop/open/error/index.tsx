import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button, Result } from 'antd'

import appHelper from '@/utils/appHelper'

const ERROR_INFO: { label: string; value: 403 | 404 | 500 | 'error' }[] = [
  { label: '权限不足', value: 403 },
  { label: '页面不存在', value: 404 },
  { label: '服务端错误', value: 500 },
  { label: '系统错误', value: 'error' },
]

const Component = () => {
  const navigate = useNavigate()

  const { t } = appHelper.lang.use()

  const [search] = useSearchParams()

  const code = useMemo(() => String(search.get('code') || 'error'), [search])

  const title = useMemo(() => String(search.get('title') || ''), [search])
  const subtitle = useMemo(() => String(search.get('subtitle') || ''), [search])

  const info = useMemo(() => ERROR_INFO.find((i) => String(i.value) === code) || ERROR_INFO[3]!, [code])

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <Result
        status={info.value}
        title={title || info.label}
        subTitle={subtitle}
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            {t('返回')}
          </Button>
        }
      />
    </div>
  )
}

export default Component
