import axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

import { store } from '@/redux'

import appHelper from '@/utils/appHelper'

import type { ResultModel, OptionModel, CustomConfigModel } from './model'

function showMsg(msg?: string) {
  appHelper.message?.destroy()
  appHelper.message?.error(!msg || typeof msg !== 'string' ? appHelper.lang.t('接口请求失败，请重试') : msg)
}

class AxiosHttp {
  private service: AxiosInstance

  constructor(config: CustomConfigModel, option?: OptionModel) {
    this.service = axios.create({ ...config, baseURL: `${config.baseURL}${option?.prefixURL || ''}` })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = store.getState().global.token
        token && (config.headers['x-token'] = token)

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    this.service.interceptors.response.use(
      ({ data, config }: AxiosResponse) => {
        if (data.code === 200) {
          return data.data
        } else {
          const { noMsg, noLogin } = config as CustomConfigModel
          if (!noMsg) {
            showMsg(data.msg)
          }

          if (data.code === 401 && !noLogin) {
            appHelper.login()
          }

          return Promise.reject(data)
        }
      },
      (error) => {
        const { noMsg, noLogin } = error.config as CustomConfigModel

        if (error.status) {
          const { code, msg } = (error.response?.data as ResultModel) || {}

          if (!noMsg) {
            if (code && msg) {
              showMsg(msg)
            } else {
              showMsg(error.msg)
            }
          }

          if ((error.status === 401 || code === 401) && !noLogin) {
            appHelper.login()
          }
        } else {
          // 无状态的请求：请求路径错误、超时
          if (!noMsg) {
            showMsg(error.msg)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  public get<T>(url: string, params?: object, config: CustomConfigModel = {}): Promise<ResultModel<T>['data']> {
    return this.service.get(url, { params, ...config })
  }

  public post<T>(url: string, data?: object, config: CustomConfigModel = {}): Promise<ResultModel<T>['data']> {
    return this.service.post(url, data, config)
  }

  public put<T>(url: string, data?: object, config: CustomConfigModel = {}): Promise<ResultModel<T>['data']> {
    return this.service.put(url, data, config)
  }

  public patch<T>(url: string, data?: object, config: CustomConfigModel = {}): Promise<ResultModel<T>['data']> {
    return this.service.patch(url, data, config)
  }

  public delete<T>(url: string, params?: object, config: CustomConfigModel = {}): Promise<ResultModel<T>['data']> {
    return this.service.delete(url, { params, ...config })
  }
}

export const genApi = (baseURL: string, option?: OptionModel) => new AxiosHttp({ baseURL, timeout: 1000 * 120 }, option)

export const apiV1 = genApi(import.meta.env.VITE_APP_API_HOST, { prefixURL: '/api/admin/v1' })
export const apiV2 = genApi(import.meta.env.VITE_APP_API_HOST, { prefixURL: '/api/admin/v2' })

export const apiBase = genApi(import.meta.env.VITE_APP_API_HOST)

const api = apiV1

export default api
