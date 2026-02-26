import { useCallback, useEffect, useState } from 'react'
import { Button, Cascader, Form, Input, Modal, Radio, Select, Table, Tag, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import api from '@/api'

import appHelper from '@/utils/appHelper'
import rand from '@/utils/rand'

interface MappingModel {
  id: string
  entry?: [string, string]
  from: string[]
  to: string
}

interface ConfigModel {
  user: MappingModel[]
  app: MappingModel[]
}

const getDef = (): ConfigModel => ({
  user: [],
  app: [],
})

const config_name = 'mapping_config'

const Component = () => {
  const { t } = appHelper.lang.use()

  const [config, setConfig] = useState<ConfigModel>()

  const [view, setView] = useState<'app' | 'user'>('app')
  const [appOptions, setAppOptions] = useState<{ label: string; value: string; children: { label: string; value: string }[] }[]>([])

  const [modalInfo, setModalInfo] = useState({ show: false, loading: false })
  const [form] = Form.useForm<MappingModel>()
  const idValue = Form.useWatch('id', form)

  const loadData = useCallback(async () => {
    const [app, config] = await Promise.all([
      api.get<{ id: string; name: string; entryData: { client: string; name: string }[] }[]>('/app/list/simplify'),
      api.get<{ key: string; value: string }[]>('/config/get', { keys: config_name }),
    ])

    const target = config.find((i) => i.key === config_name)

    setConfig({ ...getDef(), ...(target ? JSON.parse(target.value) : {}) })

    setAppOptions(
      app
        .filter((i) => (i.entryData || []).length > 0)
        .map((i) => ({ label: i.name, value: i.id, children: i.entryData.map((j) => ({ label: j.name, value: j.client })) })),
    )
  }, [])

  const updateData = useCallback(async (value: ConfigModel) => {
    await api.post('/config/update', { keys: [{ key: config_name, value: JSON.stringify(value) }] })
    appHelper.message?.success(t('操作成功'))
    setConfig(value)
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  return config ? (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <Radio.Group
          block
          options={[
            { label: t('应用'), value: 'app' },
            { label: t('用户'), value: 'user' },
          ]}
          optionType="button"
          buttonStyle="solid"
          value={view}
          onChange={(v) => setView(v.target.value)}
        />

        <Tag>映射优先级：原始标识 -&gt; 用户映射 -&gt; 应用映射</Tag>

        <div style={{ flex: 1 }}></div>

        <Button onClick={() => setModalInfo({ show: true, loading: false })}>{t('新增')}</Button>
      </div>

      {view === 'app' ? (
        <Table<ConfigModel['app'][number]>
          dataSource={config.app}
          rowKey="id"
          columns={[
            {
              title: t('应用入口'),
              dataIndex: 'entry',
              key: 'entry',
              width: 150,
              render: (_, record) => {
                if (!record.entry) {
                  return ''
                }

                const [v1, v2] = record.entry

                const app = appOptions.find((i) => i.value === v1)
                if (!app) {
                  return ''
                }

                const entry = app.children.find((i) => i.value === v2)
                if (!entry) {
                  return ''
                }

                return [app.label, entry.label].join(' / ')
              },
            },
            {
              title: t('原始值'),
              dataIndex: 'from',
              key: 'from',
              width: 300,
              render: (_, record) => record.from.join('、'),
            },
            {
              title: t('目标值'),
              dataIndex: 'to',
              key: 'to',
              width: 150,
            },
            {
              title: t('操作'),
              dataIndex: 'name',
              key: 'name',
              width: 100,
              render: (_, record, index) => (
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Typography.Link
                    onClick={() => {
                      form.setFieldsValue(record)
                      setModalInfo({ show: true, loading: false })
                    }}
                  >
                    {t('编辑')}
                  </Typography.Link>
                  <Typography.Link
                    type="danger"
                    onClick={async () => {
                      appHelper.modal?.confirm({
                        title: t('提示'),
                        icon: <ExclamationCircleOutlined />,
                        content: t('确认删除该映射吗？'),
                        okText: t('确认'),
                        cancelText: t('取消'),
                        onOk: async () => {
                          const newVal = { app: [...config.app], user: [...config.user] }
                          newVal.app.splice(index, 1)
                          await updateData(newVal)
                        },
                      })
                    }}
                  >
                    {t('删除')}
                  </Typography.Link>
                </div>
              ),
            },
          ]}
          pagination={false}
        />
      ) : (
        <Table<ConfigModel['user'][number]>
          dataSource={config.user}
          rowKey="id"
          columns={[
            {
              title: t('原始值'),
              dataIndex: 'from',
              key: 'from',
              width: 300,
              render: (_, record) => record.from.join('、'),
            },
            {
              title: t('目标值'),
              dataIndex: 'to',
              key: 'to',
              width: 150,
            },
            {
              title: t('操作'),
              dataIndex: 'name',
              key: 'name',
              width: 100,
              render: (_, record, index) => (
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Typography.Link
                    onClick={() => {
                      form.setFieldsValue(record)
                      setModalInfo({ show: true, loading: false })
                    }}
                  >
                    {t('编辑')}
                  </Typography.Link>
                  <Typography.Link
                    type="danger"
                    onClick={async () => {
                      appHelper.modal?.confirm({
                        title: t('提示'),
                        icon: <ExclamationCircleOutlined />,
                        content: t('确认删除该映射吗？'),
                        okText: t('确认'),
                        cancelText: t('取消'),
                        onOk: async () => {
                          const newVal = { app: [...config.app], user: [...config.user] }
                          newVal.user.splice(index, 1)
                          await updateData(newVal)
                        },
                      })
                    }}
                  >
                    {t('删除')}
                  </Typography.Link>
                </div>
              ),
            },
          ]}
          pagination={false}
        />
      )}

      <Modal
        open={modalInfo.show}
        title={t(`${idValue ? '编辑' : '新增'}${view === 'app' ? '应用' : '用户'}映射`)}
        destroyOnHidden={false}
        onCancel={() => {
          setModalInfo({ show: false, loading: false })
          form.resetFields()
        }}
        cancelText={t('取消')}
        okText={t('保存')}
        confirmLoading={modalInfo.loading}
        maskClosable={false}
        onOk={async () => {
          try {
            const value = await form.validateFields()
            setModalInfo({ show: true, loading: true })

            const newVal = { app: [...config.app], user: [...config.user] }

            if (view === 'app') {
              if (value.id) {
                const index = newVal.app.findIndex((i) => i.id === value.id)
                index > -1 && (newVal.app[index] = value)
              } else {
                newVal.app.push({ id: rand(8), entry: value.entry, from: value.from, to: value.to })
              }
            } else {
              if (value.id) {
                const index = newVal.user.findIndex((i) => i.id === value.id)
                index > -1 && (newVal.user[index] = value)
              } else {
                newVal.user.push({ id: rand(8), from: value.from, to: value.to })
              }
            }

            await updateData(newVal)

            setModalInfo({ show: false, loading: false })
            form.resetFields()
          } catch {
            setModalInfo({ show: true, loading: false })
            return
          }
        }}
      >
        <Form form={form} initialValues={getDef()} autoComplete="off" labelCol={{ flex: '120px' }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {view === 'app' ? (
            <>
              <Form.Item label={t('应用入口')} name="entry" rules={[{ required: true, message: t('请选择应用入口') }]}>
                <Cascader options={appOptions} placeholder={t('请选择应用入口')} showSearch />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
          <Form.Item label={t('原始值')} name="from" rules={[{ required: true, message: t('请填写原始值') }]}>
            <Select mode="tags" placeholder={t('请填写原始值')} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('目标值')} name="to" rules={[{ required: true, message: t('请填写目标值') }]}>
            <Input placeholder={t('请填写目标值')} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  ) : (
    <></>
  )
}

export default Component
