import { useCallback, useEffect } from 'react'
import { Button, Form, Switch } from 'antd'

import api from '@/api'

import appHelper from '@/utils/appHelper'

interface ConfigModel {
  open: boolean
}

const getDef = (): ConfigModel => ({
  open: true,
})

const Component = (props: { config: string }) => {
  const { t } = appHelper.lang.use()

  const [form] = Form.useForm<ConfigModel>()
  const openValue = Form.useWatch('open', form)

  const loadData = useCallback(async () => {
    const config = await api.get<{ key: string; value: string }[]>('/config/get', { keys: props.config })

    const target = config.find((i) => i.key === props.config)

    form.setFieldsValue({ ...getDef(), ...(target ? JSON.parse(target.value) : {}) })
  }, [form, props.config])

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Form
      form={form}
      hidden={openValue === undefined}
      autoComplete="off"
      labelCol={{ flex: '120px' }}
      onFinish={async (value) => {
        await api.post('/config/update', { keys: [{ key: props.config, value: JSON.stringify(value) }] })
        appHelper.message?.success(t('操作成功'))
      }}
    >
      <Form.Item label={t('启用')} name="open">
        <Switch />
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '120px' }}>
        <Button type="primary" htmlType="submit">
          {t('保存')}
        </Button>
      </div>
    </Form>
  )
}

export default Component
