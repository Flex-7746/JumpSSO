import { memo } from 'react'
import { Button, Tag, Typography } from 'antd'
import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons'

import { type } from '@/const/sso'

interface PropsModel {
  value: EntryModel
  onEdit: () => void
  onDel: () => void
}

const Component = (props: PropsModel) => {
  return (
    <div className="item">
      <div className="header">
        <div className="name">{props.value.name}</div>

        <div className="btn">
          <Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => props.onDel()} />

          <Button size="small" type="text" icon={<EditOutlined />} onClick={() => props.onEdit()} />
        </div>

        {type.find((i) => i.value === props.value.type)?.tag}
      </div>

      {props.value.type === 1 ? (
        <div className="info">
          <Tag className="t">
            <Typography.Text copyable={{ text: props.value.client }}>AppID</Typography.Text>
          </Tag>

          <Tag className="t">
            <Typography.Text copyable={{ text: props.value.oidc_config.secret }}>Secret</Typography.Text>
          </Tag>
        </div>
      ) : (
        <></>
      )}

      {props.value.type === 2 ? (
        <div className="info">
          <Button
            icon={<DownloadOutlined />}
            iconPlacement="end"
            size="small"
            onClick={() =>
              window.location.assign(`${import.meta.env.VITE_APP_API_HOST}/server/saml/metadata/${props.value.client}?download=1`)
            }
          >
            IdP Metadata
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(Component)
