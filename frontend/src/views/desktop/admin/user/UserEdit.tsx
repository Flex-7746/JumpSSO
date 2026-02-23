import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'

import Upload from '@/components/Form/Upload'

import { store } from '@/redux'

import appHelper from '@/utils/appHelper'

export interface ApiModel {
  open: (v?: UserModel) => void
  close: () => void
}

export interface PropsModel {
  onSave: (v: UserModel) => Promise<void> | void
}

const getDef = (): UserModel => ({
  id: 0,
  channel: 1,
  openid: '',
  email: '',
  phone: '',
  name: '',
  nickname: '',
  picture: '',
  password: '',
  role: 1,
  update_date: '',
  create_date: '',
})

const Component = forwardRef((props: PropsModel, ref: React.Ref<ApiModel>) => {
  const { t } = appHelper.lang.use()

  const user = useMemo<UserModel>(() => store.getState().user, [store])

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm<UserModel>()
  const idValue = Form.useWatch('id', form)
  const channelValue = Form.useWatch('channel', form)

  const onClose = useCallback(() => {
    setShow(false)
    form.resetFields()
  }, [form])

  useImperativeHandle(ref, () => ({
    open: (v = getDef()) => {
      form.setFieldsValue(v)
      setShow(true)
    },
    close: onClose,
  }))

  return (
    <Modal
      open={show}
      title={t(idValue ? '编辑用户' : '新增用户')}
      destroyOnHidden={false}
      onCancel={onClose}
      cancelText={t('取消')}
      okText={t('保存')}
      confirmLoading={loading}
      maskClosable={false}
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
      <Form form={form} initialValues={getDef()} autoComplete="off" labelCol={{ flex: '120px' }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="channel" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item label={t('邮箱')} name="email" rules={[{ required: true, message: t('请填写邮箱') }]}>
          <Input placeholder={t('请填写邮箱')} maxLength={240} showCount />
        </Form.Item>
        <Form.Item label={t('手机号')} name="phone" rules={[{ required: true, message: t('请填写手机号') }]}>
          <Input placeholder={t('请填写手机号')} maxLength={32} showCount />
        </Form.Item>
        <Form.Item label={t('姓名')} name="name" rules={[{ required: true, message: t('请填写姓名') }]}>
          <Input placeholder={t('请填写姓名')} maxLength={32} showCount />
        </Form.Item>
        <Form.Item label={t('昵称')} name="nickname">
          <Input placeholder={t('请填写昵称')} maxLength={64} showCount />
        </Form.Item>
        <Form.Item label={t('头像')} name="picture">
          <Upload dir="user" />
        </Form.Item>
        {channelValue === 1 ? (
          <>
            <Form.Item
              label={t('用户身份')}
              name="role"
              rules={[{ required: true, message: t('请选择用户身份') }]}
              hidden={user.role !== 0 || user.id === idValue}
            >
              <Select
                options={[
                  { label: '普通用户', value: 1 },
                  { label: '管理员', value: 2 },
                ]}
                placeholder={t('请选择用户身份')}
              ></Select>
            </Form.Item>
            <Form.Item label={t('用户密码')} name="password" rules={idValue ? [] : [{ required: true, message: t('请输入用户密码') }]}>
              <Input.Password placeholder={t('请输入用户密码')} />
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
