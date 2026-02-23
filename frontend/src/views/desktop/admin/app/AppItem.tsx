import { memo } from 'react'
import { Button, Card } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'

import EntryItem from './EntryItem'

import appHelper from '@/utils/appHelper'

import type { AppEntryModel } from './model'

interface PropsModel {
  value: AppEntryModel
  onEdit: () => void
  onDel: () => void
  onEntryEdit: (i?: number) => void
  onEntryDel: (i: number) => void
}

const Component = (props: PropsModel) => {
  const { t } = appHelper.lang.use()

  return (
    <Card
      className="item"
      title={
        <div className="header">
          <div className="logo">
            <img className="i" src={props.value.picture} />
          </div>

          <div className="info">
            <div className="name">{props.value.name}</div>
            <div className="desc">{props.value.desc}</div>
          </div>

          <div className="btn">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                appHelper.modal?.confirm({
                  title: t('提示'),
                  icon: <ExclamationCircleOutlined />,
                  content: (
                    <div>
                      <div>{t('确认要删除【xxxx】？', { replace: { xxxx: props.value.name } })}</div>
                      <div>{t('删除后该应用下入口均无法登录。')}</div>
                    </div>
                  ),
                  okText: t('确认'),
                  cancelText: t('取消'),
                  onOk: () => props.onDel(),
                })
              }}
            />

            <Button type="text" icon={<EditOutlined />} onClick={() => props.onEdit()} />

            <Button type="text" icon={<PlusOutlined />} onClick={() => props.onEntryEdit()} />
          </div>
        </div>
      }
    >
      {props.value.entryData.length ? (
        <div className="entry">
          {props.value.entryData.map((i, index) => (
            <EntryItem
              key={i.id}
              value={i}
              onEdit={() => props.onEntryEdit(index)}
              onDel={() => {
                appHelper.modal?.confirm({
                  title: t('提示'),
                  icon: <ExclamationCircleOutlined />,
                  content: (
                    <div>
                      <div>{t('确认要删除【xxxx-yyyy】？', { replace: { xxxx: props.value.name, yyyy: i.name } })}</div>
                      <div>{t('删除后相关应用无法登录。')}</div>
                    </div>
                  ),
                  okText: t('确认'),
                  cancelText: t('取消'),
                  onOk: () => props.onEntryDel(index),
                })
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty">{t('暂无入口')}</div>
      )}
    </Card>
  )
}

export default memo(Component)
