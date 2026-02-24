import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, Input, Pagination, Select, Table, Tag, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { md5 } from 'js-md5'

import UserEdit, { type ApiModel as UserEditApiModel } from './UserEdit'

import api from '@/api'

import { store } from '@/redux'

import channelItems from '@/const/channel/items'

import appHelper from '@/utils/appHelper'

import './index.less'

const Component = () => {
  const { t } = appHelper.lang.use()

  const user = useMemo<UserModel>(() => store.getState().user, [store])

  const [value, setValue] = useState<{ data: UserModel[]; total: number }>({ data: [], total: 0 })
  const [page, setPage] = useState({ index: 1, size: 10 })

  const [channel, setChannel] = useState(0)
  const [keywork, setKeywork] = useState('')

  const channelOptions = useMemo(
    () => [{ label: t('全部'), value: 0, color: '' }, ...channelItems.map((i) => ({ label: t(i.label), value: i.value, color: i.color }))],
    [t],
  )

  const UserEditRef = useRef<UserEditApiModel>(null)

  const loadData = useCallback(async () => {
    const result = await api.get<{ data: UserModel[]; total: number }>('/user/list', {
      pageIndex: page.index,
      pageSize: page.size,
      channel: channel ? channel : undefined,
      keywork: keywork ? keywork : undefined,
    })
    setValue({ data: result.data, total: result.total })
  }, [page, channel, keywork])

  const changePage = useCallback((index: number, size?: number) => setPage((v) => ({ ...v, index, size: size ? size : v.size })), [])

  useEffect(() => {
    loadData()
  }, [page])

  return (
    <>
      <div id="page-user-account" className="g-container">
        <div className="filter">
          <Select value={channel} options={channelOptions} onChange={setChannel} style={{ width: '100px' }}></Select>

          <Input
            className="input"
            value={keywork}
            onChange={(v) => setKeywork(v.target.value)}
            placeholder={t('名称/昵称/邮箱/手机号')}
            allowClear
            onPressEnter={() => changePage(1)}
          />

          <Button onClick={() => changePage(1)}>搜索</Button>

          <div style={{ flex: 1 }}></div>

          <Pagination
            current={page.index}
            pageSize={page.size}
            total={value.total}
            showSizeChanger
            onChange={(i) => changePage(i)}
            onShowSizeChange={(_, n) => changePage(1, n)}
            showTotal={(n) => t('共 xxxx 人', { replace: { xxxx: n } })}
          />

          <Button type="primary" onClick={() => UserEditRef.current?.open()}>
            新增
          </Button>
        </div>

        <div className="view">
          <Table<UserModel>
            dataSource={value.data}
            rowKey="id"
            columns={[
              {
                title: t('渠道'),
                dataIndex: 'channel',
                key: 'channel',
                width: 80,
                align: 'center',
                render: (_, record) => {
                  const target = channelOptions.find((i) => i.value === record.channel)
                  if (target) {
                    return (
                      <Tag color={target.color} variant="outlined">
                        {target.label}
                      </Tag>
                    )
                  } else {
                    return ''
                  }
                },
              },
              {
                title: t('角色'),
                dataIndex: 'role',
                key: 'role',
                width: 120,
                align: 'center',
                render: (_, record) => {
                  if (record.role === 0) {
                    return (
                      <Tag color="red" variant="solid">
                        {t('超级管理员')}
                      </Tag>
                    )
                  } else if (record.role === 1) {
                    return (
                      <Tag color="green" variant="outlined">
                        {t('普通用户')}
                      </Tag>
                    )
                  } else if (record.role === 2) {
                    return (
                      <Tag color="red" variant="outlined">
                        {t('管理员')}
                      </Tag>
                    )
                  } else {
                    return <Tag>{t('未知')}</Tag>
                  }
                },
              },
              {
                title: t('头像'),
                dataIndex: 'picture',
                key: 'picture',
                width: 100,
                render: (_, record) => (
                  <Avatar src={record.picture || undefined} size={32} style={record.picture ? {} : { backgroundColor: 'purple' }}>
                    {record.name[0]}
                  </Avatar>
                ),
              },
              { title: t('邮箱'), dataIndex: 'email', width: 160, ellipsis: { showTitle: true } },
              { title: t('手机号'), dataIndex: 'phone', width: 160, ellipsis: { showTitle: true } },
              { title: t('姓名'), dataIndex: 'name', width: 160, ellipsis: { showTitle: true } },
              { title: t('昵称'), dataIndex: 'nickname', width: 160, ellipsis: { showTitle: true } },
              {
                title: t('操作'),
                dataIndex: 'name',
                key: 'name',
                width: 160,
                render: (_, record) => {
                  // 理论不可能
                  if (user.role === 1) {
                    return <></>
                  }

                  const isMine = user.id === record.id

                  if (user.role === 2 && record.role !== 1 && !isMine) {
                    return <></>
                  }

                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <Typography.Link onClick={() => UserEditRef.current?.open({ ...record, password: '' })}>{t('编辑')}</Typography.Link>

                      {isMine ? (
                        <></>
                      ) : (
                        <Typography.Link
                          type="danger"
                          onClick={() => {
                            appHelper.modal?.confirm({
                              title: t('提示'),
                              icon: <ExclamationCircleOutlined />,
                              content: (
                                <div>
                                  <div>{t('确认要删除【xxxx】？', { replace: { xxxx: record.name } })}</div>
                                  {record.channel === 1 ? (
                                    <div>{t('删除后其无法使用账户密码进行登录。')}</div>
                                  ) : (
                                    <div>{t('删除后账户信息将根据配置进行同步。')}</div>
                                  )}
                                </div>
                              ),
                              okText: t('确认'),
                              cancelText: t('取消'),
                              onOk: async () => {
                                await api.delete('/user/delete', { id: record.id })
                                appHelper.message?.success(t('操作成功'))
                                if (value.data.length === 1 && page.index > 1) {
                                  changePage(page.index - 1)
                                } else {
                                  await loadData()
                                }
                              },
                            })
                          }}
                        >
                          {t('删除')}
                        </Typography.Link>
                      )}
                    </div>
                  )
                },
              },
            ]}
            pagination={false}
          />
        </div>
      </div>

      <UserEdit
        ref={UserEditRef}
        onSave={async (v) => {
          const item = {
            email: v.email,
            phone: v.phone,
            name: v.name,
            nickname: v.nickname ? v.nickname : undefined,
            picture: v.picture ? v.picture : undefined,
            password: v.password ? md5(v.password) : undefined,
            role: v.role,
          }

          if (v.id) {
            await api.put('/user/update', { ...item, id: v.id })
          } else {
            await api.post('/user/add', item)
          }

          appHelper.message?.success(t('操作成功'))

          await loadData()
        }}
      />
    </>
  )
}

export default Component
