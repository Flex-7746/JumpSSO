import antdZH from 'antd/es/locale/zh_CN'
import antdEN from 'antd/es/locale/en_US'

import dayjsZH from 'dayjs/locale/zh-cn'
import dayjsEN from 'dayjs/locale/en'

export const langs = Object.entries(import.meta.glob('./langs/*.ts', { eager: true })).reduce(
  (obj: { [x: string]: { [x: string]: string } }, [path, value]) => {
    const key = path.split('/').pop()?.replace('.ts', '')

    if (key) {
      obj[key] = (value as { default: { [x: string]: string } }).default
    }

    return obj
  },
  {},
)

// 手动排序
export const langsOption = [
  { label: 'English', value: 'en', antd: antdEN, dayjs: dayjsEN },
  { label: '简体中文', value: 'zh-Hans', antd: antdZH, dayjs: dayjsZH },
]

// 获取 cn 的映射
export const getCnMap = () => {
  const cnMap = new Map<string, string[]>()

  Object.entries(langs['zh-Hans']).forEach(([key, value]) => {
    const map = cnMap.get(value)
    if (map) {
      map.push(key)
    } else {
      cnMap.set(value, [key])
    }
  })

  return cnMap
}
