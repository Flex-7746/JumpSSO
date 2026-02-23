import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { LoadingOutlined } from '@ant-design/icons'

import channelLogin from '@/const/channel/login'
import { loadSDK } from '@/const/channel/sdk'

const Component = () => {
  const [search] = useSearchParams()
  const params = useParams()

  useEffect(() => {
    const type = Number(params.type || '')
    const key = params.key || ''
    const code = search.get('code') || ''

    if (type && key && code) {
      loadSDK().then(() => channelLogin.jump({ type, key, code }))
    }
  }, [])

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <LoadingOutlined />
    </div>
  )
}

export default Component
