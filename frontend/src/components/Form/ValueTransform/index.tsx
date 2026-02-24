import { cloneElement, type JSX } from 'react'
import dayjs from 'dayjs'

interface PropsModel {
  children: JSX.Element
  value?: any
  onChange?: (val: PropsModel['value']) => void
  cValueField?: string
  cChangeField?: string
  preset?: string
  date?: { def: boolean; format: string }
  p2f?: (val: PropsModel['value']) => PropsModel['value'] // params > form
  f2p?: (val: PropsModel['value'], old: PropsModel['value']) => PropsModel['value'] // form > params
}

const Component: React.FC<PropsModel> = (props) => {
  const p2f = (v?: any) => {
    if (typeof v === 'undefined') {
      return v
    }

    if (props.p2f) {
      return props.p2f(v)
    }

    if (props.preset) {
      if (props.preset === 'switch') {
        return Boolean(v)
      } else if (props.preset.indexOf('date') === 0) {
        if ((typeof v !== 'undefined' && v !== null) || props.date?.def) {
          if (Array.isArray(v)) {
            return v.map((i) => dayjs(i))
          } else {
            return dayjs(v)
          }
        }
      } else if (props.preset === 'str2arr') {
        return v.split(',').filter((i: string) => !!i)
      }
    }

    return v
  }

  const f2p = (v?: any, o?: any) => {
    if (typeof v === 'undefined') {
      return v
    }

    if (props.f2p) {
      return props.f2p(v, o)
    }

    if (props.preset) {
      if (props.preset === 'switch') {
        return Number(v)
      } else if (props.preset.indexOf('date') === 0) {
        if (typeof v !== 'undefined' && v !== null) {
          const format = props.preset.slice(5) || 'YYYY-MM-DD'
          if (Array.isArray(v)) {
            return v.map((i: dayjs.Dayjs) => i.format(format))
          } else {
            return (v as dayjs.Dayjs).format(format)
          }
        }
      } else if (props.preset === 'str2arr') {
        return v.join(',')
      }
    }

    return v
  }

  return cloneElement(props.children, {
    [props.cValueField || 'value']: p2f(props.value),
    [props.cChangeField || 'onChange']: (v: PropsModel['value']) => props.onChange?.(f2p(v, props.value)),
  })
}

export default Component
