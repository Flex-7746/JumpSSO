import { type AxiosRequestConfig } from 'axios'

export interface ResultModel<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface OptionModel {
  prefixURL?: string
}

export interface CustomConfigModel extends AxiosRequestConfig {
  noMsg?: boolean
  noLogin?: boolean
}
