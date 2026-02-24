import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input, Pagination } from 'antd'

import AppItem from './AppItem'
import AppEdit, { type ApiModel as AppEditApiModel } from './AppEdit'
import EntryEdit, { type ApiModel as EntryEditApiModel } from './EntryEdit'

import api from '@/api'

import appHelper from '@/utils/appHelper'
import { getOidcConfig, getSamlConfig } from './util'

import type { AppEntryModel } from './model'

import './index.less'

const Component = () => {
  const { t } = appHelper.lang.use()

  const [value, setValue] = useState<{ data: AppEntryModel[]; total: number }>({ data: [], total: 0 })
  const [page, setPage] = useState({ index: 1, size: 10 })

  const [search, setSearch] = useState('')

  const AppEditRef = useRef<AppEditApiModel>(null)
  const EntryEditRef = useRef<EntryEditApiModel>(null)

  const loadData = useCallback(async () => {
    const result = await api.get<{ data: AppEntryModel[]; total: number }>('/app/list', {
      pageIndex: page.index,
      pageSize: page.size,
      name: search ? search : undefined,
    })

    setValue({
      data: result.data.map((i) => ({
        ...i,
        entryData: i.entryData.map((j) => ({ ...j, oidc_config: getOidcConfig(j), saml_config: getSamlConfig(j) })),
      })),
      total: result.total,
    })
  }, [page, search])

  const changePage = useCallback((index: number, size?: number) => setPage((v) => ({ ...v, index, size: size ? size : v.size })), [])

  useEffect(() => {
    loadData()
  }, [page])

  return (
    <>
      <div id="page-app" className="g-container">
        <div className="filter">
          <Input
            className="input"
            value={search}
            onChange={(v) => setSearch(v.target.value)}
            placeholder={t('名称')}
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
            showTotal={(n) => t('共 xxxx 个应用', { replace: { xxxx: n } })}
          />

          <Button type="primary" onClick={() => AppEditRef.current?.open()}>
            新增
          </Button>
        </div>

        <div className="view">
          {value.data.map((i) => (
            <AppItem
              key={i.id}
              value={i}
              onEdit={() => AppEditRef.current?.open(i)}
              onDel={async () => {
                await api.delete('/app/delete', { id: i.id })
                appHelper.message?.success(t('操作成功'))
                await loadData()
              }}
              onEntryEdit={(index) => EntryEditRef.current?.open({ app_id: i.id, ...(index === undefined ? {} : i.entryData[index]) })}
              onEntryDel={async (index) => {
                await api.delete('/entry/delete', { id: i.entryData[index].id })
                appHelper.message?.success(t('操作成功'))
                await loadData()
              }}
            />
          ))}
        </div>
      </div>

      <AppEdit
        ref={AppEditRef}
        onSave={async (v) => {
          const item = { name: v.name, picture: v.picture || '', desc: v.desc || '' }

          if (v.id) {
            await api.put('/app/update', { ...item, id: v.id })
          } else {
            await api.post('/app/add', item)
          }

          appHelper.message?.success(t('操作成功'))

          await loadData()
        }}
      />

      <EntryEdit
        ref={EntryEditRef}
        onSave={async (v) => {
          const item = {
            name: v.name,
            url: v.url,
            type: v.type,
            oidc_config: v.oidc_config ? JSON.stringify(v.oidc_config) : undefined,
            saml_config: v.saml_config ? JSON.stringify(v.saml_config) : undefined,
          }

          if (v.id) {
            await api.put('/entry/update', { ...item, id: v.id })
          } else {
            await api.post('/entry/add', { ...item, app_id: v.app_id })
          }

          appHelper.message?.success(t('操作成功'))

          await loadData()
        }}
      />
    </>
  )
}

export default Component
