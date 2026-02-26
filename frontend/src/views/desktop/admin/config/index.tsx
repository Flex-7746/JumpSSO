import { Tabs } from 'antd'

import Mapping from './Mapping'

import appHelper from '@/utils/appHelper'

import channelItems from '@/const/channel/items'

const Component = () => {
  const { t } = appHelper.lang.use()

  return (
    <div className="g-container">
      <Tabs
        items={[
          ...channelItems.map((i) => ({ label: t(i.label), key: i.config, children: <i.admin config={i.config} /> })),

          { label: t('映射'), key: 'mapping', children: <Mapping /> },
        ]}
      />
    </div>
  )
}

export default Component
