export interface ConfigModel {
  account?: boolean
  feishu?: { appId: string }
  dingding?: { corpId: string; clientId: string }
  qiwei?: { corpId: string; appAgentId: string }
  feiniu?: { host: string; clientId: string }
}
