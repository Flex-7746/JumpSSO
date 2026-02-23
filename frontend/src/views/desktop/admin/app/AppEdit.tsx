import { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react'
import { Form, Input, Modal } from 'antd'

import Upload from '@/components/Form/Upload'

import appHelper from '@/utils/appHelper'
import { getAppDef } from './util'

export interface ApiModel {
  open: (v?: AppModel) => void
  close: () => void
}

export interface PropsModel {
  onSave: (v: AppModel) => Promise<void> | void
}

const Component = forwardRef((props: PropsModel, ref: React.Ref<ApiModel>) => {
  const { t } = appHelper.lang.use()

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm<AppModel>()
  const idValue = Form.useWatch('id', form)

  const onClose = useCallback(() => {
    setShow(false)
    form.resetFields()
  }, [form])

  useImperativeHandle(ref, () => ({
    open: (v = getAppDef()) => {
      form.setFieldsValue(v)
      setShow(true)
    },
    close: onClose,
  }))

  return (
    <Modal
      open={show}
      title={t(idValue ? '编辑应用' : '新增应用')}
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
      <Form form={form} initialValues={getAppDef()} autoComplete="off" labelCol={{ flex: '120px' }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item label={t('应用图标')} name="picture" rules={[{ required: true, message: t('请上传应用图标') }]}>
          <Upload dir="app" />
        </Form.Item>
        <Form.Item label={t('应用名称')} name="name" rules={[{ required: true, message: t('请填写应用名称') }]}>
          <Input placeholder={t('请填写应用名称')} maxLength={32} showCount />
        </Form.Item>
        <Form.Item label={t('应用介绍')} name="desc">
          <Input.TextArea placeholder={t('请填写应用介绍')} rows={4} maxLength={512} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default memo(Component)
