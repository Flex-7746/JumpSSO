import { useSearchParams } from 'react-router'
import { Button, Card, Form, Input, Tag } from 'antd'
import { md5 } from 'js-md5'
import { debounce } from 'lodash'

import api from '@/api'

import { store } from '@/redux'
import { update as updateGlobal } from '@/redux/reducer/global'

import { SYS_PATH } from '@/config'

import appHelper from '@/utils/appHelper'

interface UserModel {
  username: string
  password: string
}

const Component = () => {
  const { t } = appHelper.lang.use()

  const [search] = useSearchParams()

  const [form] = Form.useForm<UserModel>()

  const login = debounce(async (value: UserModel) => {
    try {
      const { token } = await api.post<{ token: string }>('/sign/login', { username: value.username, password: md5(value.password) })

      store.dispatch(updateGlobal({ token }))

      const redirect = search.get('redirect') || ''

      appHelper.navigate?.(redirect ? decodeURIComponent(redirect) : SYS_PATH.index)

      appHelper.message?.success(t('登录成功'))
    } catch {
      return
    }
  }, 300)

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '96px 48px' }}>
      <Card title={t('后台登录')} extra={<Tag color="blue">JumpSSO</Tag>}>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={login}>
          <Form.Item label={t('账户')} name="username" rules={[{ required: true, message: t('请输入邮箱或手机号') }]}>
            <Input placeholder={t('请输入邮箱或手机号')} />
          </Form.Item>

          <Form.Item label={t('密码')} name="password" rules={[{ required: true, message: t('请输入密码') }]}>
            <Input.Password placeholder={t('请输入密码')} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              {t('登录')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Component
