import { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react'
import { Form, Input, InputNumber, Modal, Radio, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import AttributeMap from '@/components/Form/AttributeMap'

import { type as ssoType } from '@/const/sso'

import appHelper from '@/utils/appHelper'
import rand from '@/utils/rand'
import { getEntryDef } from './util'

export interface ApiModel {
  open: (v: Partial<EntryModel>) => void
  close: () => void
}

export interface PropsModel {
  onSave: (v: EntryModel) => Promise<void> | void
}

const Component = forwardRef((props: PropsModel, ref: React.Ref<ApiModel>) => {
  const { t } = appHelper.lang.use()

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm<EntryModel>()
  const idValue = Form.useWatch('id', form)
  const typeValue = Form.useWatch('type', form)

  const onClose = useCallback(() => {
    setShow(false)
    form.resetFields()
  }, [form])

  useImperativeHandle(ref, () => ({
    open: (v) => {
      form.setFieldsValue({ ...getEntryDef(), ...v })
      setShow(true)
    },
    close: onClose,
  }))

  return (
    <Modal
      open={show}
      title={t(idValue ? '编辑入口' : '新增入口')}
      destroyOnHidden={false}
      onCancel={onClose}
      cancelText={t('取消')}
      okText={t('保存')}
      confirmLoading={loading}
      maskClosable={false}
      width={640}
      onOk={async () => {
        try {
          const value = await form.validateFields()
          setLoading(true)
          await props.onSave(value)
          setLoading(false)
          onClose()
        } catch {
          setLoading(false)
          return
        }
      }}
    >
      <Form form={form} initialValues={getEntryDef()} autoComplete="off" labelCol={{ flex: '120px' }} size="small">
        <Form.Item name="app_id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item label={t('协议')} name="type" rules={[{ required: true, message: t('请选择登录类型') }]}>
          <Radio.Group options={ssoType}></Radio.Group>
        </Form.Item>
        <Form.Item label={t('名称')} name="name" rules={[{ required: true, message: t('请填写名称') }]}>
          <Input placeholder={t('请填写名称')} maxLength={32} showCount />
        </Form.Item>
        <Form.Item label={t('地址')} name="url" rules={[{ required: true, message: t('请填写地址') }]}>
          <Input placeholder={t('请填写地址')} maxLength={1024} showCount />
        </Form.Item>

        {typeValue === 1 ? (
          <>
            <Form.Item label={t('认证密钥')} name={['oidc_config', 'secret']} rules={[{ required: true, message: t('请填写认证密钥') }]}>
              <Input
                placeholder={t('请填写认证密钥')}
                maxLength={32}
                suffix={<ReloadOutlined onClick={() => form.setFieldValue(['oidc_config', 'secret'], rand(32))} />}
              />
            </Form.Item>
            <Form.Item label={t('回调地址')} name={['oidc_config', 'redirect']} rules={[{ required: true, message: t('请填写回调地址') }]}>
              <Input placeholder={t('请填写回调地址')} maxLength={1024} showCount />
            </Form.Item>
            <Form.Item label={t('用户标识')} name={['oidc_config', 'userFlag']} rules={[{ required: true, message: t('请填写用户标识') }]}>
              <Input placeholder={t('请填写用户标识')} maxLength={256} showCount />
            </Form.Item>
            <Form.Item hidden label={t('属性映射')} name={['oidc_config', 'attribute']}>
              <AttributeMap />
            </Form.Item>
          </>
        ) : (
          <></>
        )}

        {typeValue === 2 ? (
          <>
            <Form.Item label={t('加密私钥')} name={['saml_config', 'key']} rules={[{ required: true, message: t('请填写加密私钥') }]}>
              <Input.TextArea placeholder={t('请填写加密私钥')} rows={2} maxLength={8192} showCount />
            </Form.Item>
            <Form.Item label={t('私钥密码')} name={['saml_config', 'keyPass']}>
              <Input placeholder={t('如果加密请填写私钥密码')} maxLength={32} />
            </Form.Item>
            <Form.Item label={t('签名证书')} name={['saml_config', 'cer']} rules={[{ required: true, message: t('请填写签名证书') }]}>
              <Input.TextArea placeholder={t('请填写签名证书')} rows={2} maxLength={8192} showCount />
            </Form.Item>
            <Form.Item
              label={t('SP Metadata')}
              name={['saml_config', 'spMetadata']}
              rules={[{ required: true, message: t('请填写 SP Metadata') }]}
            >
              <Input.TextArea placeholder={t('请填写 SP Metadata')} rows={2} maxLength={8192} showCount />
            </Form.Item>
            <Form.Item
              label={t('SP NameID')}
              name={['saml_config', 'spNameid']}
              rules={[{ required: true, message: t('请填写 SP NameID') }]}
            >
              <Input placeholder={t('请填写 SP NameID')} maxLength={256} showCount />
            </Form.Item>
            <Form.Item label={t('登录态过期')} required>
              <Space>
                <div>{t('应用登录态')}</div>
                <Form.Item
                  noStyle
                  name={['saml_config', 'spLoginExpire']}
                  rules={[{ required: true, message: t('请填写登录过期') }]}
                  style={{ margin: '0 12px' }}
                >
                  <InputNumber min={5} style={{ width: '80px' }} controls={false} />
                </Form.Item>
                <div>{t('分钟后失效')}</div>
              </Space>
            </Form.Item>
            <Form.Item label={t('用户标识')} name={['saml_config', 'userFlag']} rules={[{ required: true, message: t('请填写用户标识') }]}>
              <Input placeholder={t('请填写用户标识')} maxLength={256} showCount />
            </Form.Item>
            <Form.Item label={t('属性映射')} name={['saml_config', 'attribute']}>
              <AttributeMap />
            </Form.Item>
          </>
        ) : (
          <></>
        )}
      </Form>
    </Modal>
  )
})

export default memo(Component)
