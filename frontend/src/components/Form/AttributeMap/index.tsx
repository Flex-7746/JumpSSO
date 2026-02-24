import { useCallback, useMemo } from 'react'
import { Button, Input, Select } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import appHelper from '@/utils/appHelper'

export interface PropsModel {
  value?: AttributeMapModel[]
  onChange?: (v: PropsModel['value']) => void
  disabledDel?: boolean
}

const Component = (props: PropsModel) => {
  const { t } = appHelper.lang.use()

  const fullOptions = useMemo<{ label: string; value: AttributeMapModel['left'] }[]>(
    () => [
      { label: t('邮箱'), value: 'email' },
      { label: t('手机号'), value: 'phone' },
      { label: t('姓名'), value: 'name' },
      { label: t('昵称'), value: 'nickname' },
      { label: t('头像'), value: 'picture' },
    ],
    [t],
  )

  const getUseOption = useCallback(
    (index: number) => {
      if (!props.value) {
        return fullOptions
      }

      const target = props.value[index]
      const exclude = props.value.map((i) => i.left).filter((i) => i !== target.left)

      return fullOptions.filter((i) => !exclude.includes(i.value))
    },
    [fullOptions, props.value],
  )

  const addItem = useCallback(() => {
    const exclude = props.value?.map((i) => i.left) || []
    const target = fullOptions.find((i) => !exclude.includes(i.value))

    if (!target) {
      return
    }

    const newValue = [...(props.value || [])]
    newValue.push({ left: target.value, right: target.value })
    props.onChange?.(newValue)
  }, [fullOptions, props])

  const delItem = useCallback(
    (index: number) => {
      const newValue = [...(props.value || [])]
      newValue.splice(index, 1)
      props.onChange?.(newValue)
    },
    [props],
  )

  const changeItem = useCallback(
    (index: number, type: 'left' | 'right', value: string) => {
      const target = props.value?.[index]
      if (!target) {
        return
      }

      const newValue = [...(props.value || [])]
      newValue.splice(index, 1, { ...target, [type]: value })
      props.onChange?.(newValue)
    },
    [props],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {props.value?.map((i, index) => (
        <div key={i.left} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Select options={getUseOption(index)} value={i.left} onChange={(v) => changeItem(index, 'left', v)}></Select>

          <Input placeholder={t('请选择对应值')} value={i.right} onChange={(v) => changeItem(index, 'right', v.target.value)} />

          {props.disabledDel ? (
            <></>
          ) : (
            <Button type="text" danger shape="circle" icon={<DeleteOutlined />} onClick={() => delItem(index)} />
          )}
        </div>
      ))}

      {props.value?.length === fullOptions.length ? <></> : <Button onClick={() => addItem()}>{t('添加')}</Button>}
    </div>
  )
}

export default Component
