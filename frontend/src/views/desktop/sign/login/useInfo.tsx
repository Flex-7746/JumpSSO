import { useCallback, useEffect, useState } from 'react'

import { apiBase as api } from '@/api'

import appHelper from '@/utils/appHelper'

import type { ConfigModel } from '@/const/channel/model'

export interface InfoModel extends ConfigModel {
  app: {
    name: string
    picture: string
    desc: string
    entry: string
  }
}

interface OptionModel {
  key: string
  onBefore?: () => void | Promise<void>
  onAfter?: (info: InfoModel) => void | Promise<void>
  onError?: (title: string, subtitle: string) => void
}

export default function useInfo(opt: OptionModel) {
  const { t } = appHelper.lang.use()

  const [info, setInfo] = useState<InfoModel>()

  const load = useCallback(async () => {
    try {
      if (!opt.key) {
        opt.onError?.(t('参数缺失'), t('请检查地址信息'))
        return
      }

      await opt.onBefore?.()

      const result = await api.get<InfoModel>('/server/info', { key: opt.key }, { noMsg: true })

      setInfo(result)

      await opt.onAfter?.(result)
    } catch (e: any) {
      opt.onError?.(t('应用信息获取失败'), e.msg)
    }
  }, [opt])

  useEffect(() => {
    load()
  }, [])

  return { info }
}
