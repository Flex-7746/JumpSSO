import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { SYS_PATH } from '@/config'

import { langsOption, getCnMap } from '@/lib/i18n/handle'

import { update as updateGlobal } from '@/redux/reducer/global'

import type { Dispatch } from 'react'
import type { NavigateFunction, Location } from 'react-router'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'
import type { HookAPI as ModalInstance } from 'antd/es/modal/useModal'
import type { RouteModel } from '@/router/model'

interface HelperModel {
  dispatch?: Dispatch<unknown>

  navigate?: NavigateFunction
  location?: Location
  route?: RouteModel
  routeTree?: RouteModel[]

  message?: MessageInstance
  notification?: NotificationInstance
  modal?: ModalInstance
}

class Helper {
  // 更新
  public save(obj: Partial<HelperModel>) {
    Object.assign(this, obj)
  }

  // 登录
  public login = () => {
    const redirect = this.location ? encodeURIComponent(this.location.pathname + this.location.search) : ''

    this.navigate?.(`${SYS_PATH.login}${redirect ? `?redirect=${redirect}` : ''}`, { replace: true })
  }

  // 区服信息
  public region: 'zh' | 'en' = import.meta.env.VITE_APP_REGION

  // Redux
  public dispatch: HelperModel['dispatch']

  /**
   * Router
   * 路由数据一般用于工具或函数中使用，以便函数调用到当前页面的路由信息。
   * 请不要在页面的 useEffect 中使用，因为这样会得到上个页面的路由数据。
   * 因为这里的是基于全局组件进行监听并设置，而页面切换的 useEffect 先于全局组件。
   * 如果非要在 useEffect 中使用，那么就使用 setTimeout(() => {}, 0) 进行延迟获取。
   */
  public navigate: HelperModel['navigate']
  public location: HelperModel['location']
  public route: HelperModel['route']
  public routeTree: HelperModel['routeTree']

  // 全局 antd
  public message: HelperModel['message']
  public notification: HelperModel['notification']
  public modal: HelperModel['modal']

  // lang 封装
  public lang = {
    map: getCnMap(),

    index: (v: string) => langsOption.findIndex((i) => i.value === v),

    target: (v: string) => langsOption[this.lang.index(v)] || langsOption[0],

    use: () => {
      const { i18n } = useTranslation()

      return {
        i18n,

        t: (cn: string, opt?: { key?: string; replace?: { [x: string]: string | number } }) => {
          const warn = false

          const paths = this.lang.map.get(cn)
          let val = cn

          if (paths) {
            if (paths.length > 1) {
              warn && console.warn(`「${cn}」存在多个 key，请传参指定`, paths)
            }

            const path = opt && opt.key ? opt.key : paths[0]

            val = i18n.t(path)

            if (val === path) {
              warn && console.warn(`「${cn}」未配置当前语言翻译，请检查翻译表`, paths)
              val = cn
            }
          } else {
            warn && console.warn(`「${cn}」未配置中文翻译，请检查翻译表`)
          }

          if (opt && opt.replace) {
            Object.entries(opt.replace).forEach((i) => {
              val = val.replace(i[0], String(i[1]))
            })
          }

          return val
        },

        change: (lang: string) => {
          const item = langsOption.find((i) => i.value === lang)

          if (item) {
            i18n.changeLanguage(lang)
            dayjs.locale(item.dayjs)
            this.dispatch?.(updateGlobal({ lang }))
          }
        },
      }
    },

    t: (v: string) => v,
  }
}

export default new Helper()
