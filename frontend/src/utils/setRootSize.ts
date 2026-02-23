// import { IS_DEV } from '@/config'

import { IS_MOBILE, W } from '@/utils/env'

export default async function setRootSize(designWidth = 750, clientWidth = W) {
  if (!IS_MOBILE) {
    return
  }

  // IS_DEV && (await import('eruda')).default.init()
  ;(await import('eruda')).default.init()

  const size = (clientWidth / designWidth) * 100

  document.documentElement.style.fontSize = size + 'px'

  // 插入一个 div 来确定是否是期望大小，主要解决移动端系统设置字体大小的问题
  const div = document.createElement('div')
  div.style.width = '1rem'
  div.style.height = '0'
  document.body.appendChild(div)

  const rmd = div.clientWidth / size
  if (rmd > 1.05 || rmd < 0.95) {
    document.documentElement.style.fontSize = `${size / rmd}px`
  }

  document.body.removeChild(div)
}
