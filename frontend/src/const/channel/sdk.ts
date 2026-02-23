import { requestAuthCode, closePage } from 'dingtalk-jsapi'
import { register, closeWindow as wwCloseWindow } from '@wecom/jssdk'

import loadScript from '@/utils/loadScript'
import { IS_DD, IS_FS, IS_QW } from '@/utils/env'

import type { ConfigModel } from './model'

const sdk: { type: number; handler: any } = { type: 0, handler: null }

export const loadSDK = async () => {
  if (IS_FS) {
    sdk.type = 2
    sdk.handler = await loadScript('https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.45.js', 'tt')
  } else if (IS_DD) {
    sdk.type = 3
    sdk.handler = { requestAuthCode, closePage }
  } else if (IS_QW) {
    sdk.type = 4
    sdk.handler = { register, closeWindow: wwCloseWindow }
  }

  return sdk
}

export const getCode = async (config: ConfigModel, key: string) => {
  if (!sdk.handler) {
    await loadSDK()
  }

  const result = { type: sdk.type, code: '' }

  if (!sdk.type) {
    return result
  }

  if (sdk.type === 2) {
    result.code = await new Promise((resolve) => {
      config.feishu
        ? sdk.handler.requestAccess({
            scopeList: [],
            appID: config.feishu.appId,
            success: (v: any) => resolve(v.code),
            fail: () => resolve(''),
          })
        : resolve('')
    })
  } else if (sdk.type === 3) {
    result.code = await new Promise((resolve) => {
      config.dingding
        ? sdk.handler.requestAuthCode({
            corpId: config.dingding.corpId,
            clientId: config.dingding.clientId,
            success: (v: any) => resolve(v.code),
            fail: () => resolve(''),
          })
        : resolve('')
    })
  } else if (sdk.type === 4) {
    if (config.qiwei) {
      window.location.replace(
        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.qiwei.corpId}&redirect_uri=${encodeURIComponent(window.location.origin + `/sign/callback/4/${key}`)}&response_type=code&scope=snsapi_privateinfo&agentid=${config.qiwei.appAgentId}#wechat_redirect`,
      )

      await new Promise((resolve) => setTimeout(resolve, 10000))
    }
  }

  return result
}

export const closeWindow = async () => {
  if (sdk.type === 3) {
    sdk.handler.closePage()
  } else if (sdk.type === 4) {
    sdk.handler.closeWindow()
  } else {
    window.close()
  }
}
