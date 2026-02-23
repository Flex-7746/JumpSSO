import { useCallback, useEffect } from 'react'
import { Button, Form, Input, Switch } from 'antd'

import AttributeMap from '@/components/Form/AttributeMap'

import api from '@/api'

import appHelper from '@/utils/appHelper'

interface ConfigModel {
  open: boolean
  corpId: string
  appAgentId: string
  appSecret: string
  attribute: AttributeMapModel[]
  saveInfo: boolean
}

const getDef = (): ConfigModel => ({
  open: false,
  corpId: '',
  appAgentId: '',
  appSecret: '',
  attribute: [
    { left: 'email', right: 'email' },
    { left: 'phone', right: 'mobile' },
    { left: 'name', right: 'name' },
    { left: 'nickname', right: 'alias' },
    { left: 'picture', right: 'avatar' },
  ],
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
          <Form.Item label={t('企业 ID')} name="corpId" rules={[{ required: true, message: t('请填写企业 ID') }]}>
            <Input placeholder={t('请填写企业 ID')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('应用 AgentId')} name="appAgentId" rules={[{ required: true, message: t('请填写应用 AgentId') }]}>
            <Input placeholder={t('请填写应用 AgentId')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('应用 Secret')} name="appSecret" rules={[{ required: true, message: t('请填写应用 Secret') }]}>
            <Input.Password placeholder={t('请填写应用 Secret')} maxLength={128} />
          </Form.Item>
          <Form.Item label={t('属性映射')} name="attribute">
            <AttributeMap disabledDel />
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
