import { md5 } from 'js-md5'
import { debounce } from 'lodash'

import { apiBase as api } from '@/api'

import { closeWindow, getCode } from './sdk'

import type { ConfigModel } from './model'

interface Fn {
  before?: () => void
  after?: () => void
}

export default {
  account: debounce(async (opt: { key: string; username: string; password: string }, fn?: Fn) => {
    try {
      fn?.before?.()
      await api.post('/server/login', { type: 1, key: opt.key, username: opt.username, password: md5(opt.password) })
    } finally {
      fn?.after?.()
    }
  }, 300),

  sdk: debounce(async (opt: { key: string; info: ConfigModel }, fn?: Fn) => {
    try {
      fn?.before?.()
      const { type, code } = await getCode(opt.info, opt.key)
      if (code) {
        await api.post('/server/login', { key: opt.key, type, code })
        closeWindow()
      }
    } finally {
      fn?.after?.()
    }
  }, 300),

  jump: debounce(async (opt: { type: number; key: string; code: string }, fn?: Fn) => {
    try {
      fn?.before?.()
      await api.post('/server/login', { type: opt.type, key: opt.key, code: opt.code })
      closeWindow()
    } finally {
      fn?.after?.()
    }
  }, 300),
}
