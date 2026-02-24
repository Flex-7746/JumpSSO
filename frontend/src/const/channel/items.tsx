import Account from './admin/Account'
import FeiShu from './admin/FeiShu'
import DingDing from './admin/DingDing'
import QiWei from './admin/QiWei'
import FeiNiu from './admin/FeiNiu'

import { type ConfigModel } from './model'

export default [
  {
    label: '内置',
    value: 1,
    config: 'account_config',
    color: '',
    admin: Account,
    qrcode: false,
  },
  {
    label: '飞书',
    value: 2,
    config: 'feishu_config',
    color: '#25D1B1',
    admin: FeiShu,
    qrcode: true,
    jump: () => `https://applink.feishu.cn/client/web_url/open?mode=sidebar-semi&url=${encodeURIComponent(window.location.href)}`,
  },
  {
    label: '钉钉',
    value: 3,
    config: 'dingding_config',
    color: '#0162F5',
    admin: DingDing,
    qrcode: true,
    jump: () => `https://applink.dingtalk.com/page/link?target=slide&url=${encodeURIComponent(window.location.href)}`,
  },
  {
    label: '企微',
    value: 4,
    config: 'qiwei_config',
    color: '#2DD966',
    admin: QiWei,
    qrcode: true,
  },
  {
    label: '飞牛',
    value: 5,
    config: 'feiniu_config',
    color: '#1662E7',
    admin: FeiNiu,
    qrcode: false,
    jump: (config: ConfigModel, params: { key: string }) => {
      if (config.feiniu) {
        const { host, clientId } = config.feiniu
        return `${host}/signin?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin + `/sign/callback/5/${params.key}`)}&app_name=JumpSSO`
      } else {
        return ''
      }
    },
  },
]
