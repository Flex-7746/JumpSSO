import { useCallback, useEffect } from 'react'
import { Button, Form, Input, Switch } from 'antd'

import api from '@/api'

import appHelper from '@/utils/appHelper'

interface ConfigModel {
  open: boolean
  host: string
  clientId: string
  clientSecret: string
  saveInfo: boolean
}

const getDef = (): ConfigModel => ({
  open: false,
  host: '',
  clientId: '',
  clientSecret: '',
  saveInfo: true,
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

      {openValue ? (
        <>
          <Form.Item label={t('飞牛地址')} name="host" rules={[{ required: true, message: t('请填写飞牛地址') }]}>
            <Input placeholder={t('请填写飞牛地址')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('Client ID')} name="clientId" rules={[{ required: true, message: t('请填写 Client ID') }]}>
            <Input placeholder={t('请填写 Client ID')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('Client Secret')} name="clientSecret" rules={[{ required: true, message: t('请填写 Client Secret') }]}>
            <Input.Password placeholder={t('请填写Client Secret')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('存储用户数据')} name="saveInfo">
            <Switch />
          </Form.Item>
        </>
      ) : (
        <></>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '120px' }}>
        <Button type="primary" htmlType="submit">
          {t('保存')}
        </Button>
      </div>
    </Form>
  )
}

export default Component
