interface AttributeMapModel {
  left: string
  right: string
}

interface BaseModel {
  id: number
  create_date: string
  update_date: string
}

interface AppModel extends BaseModel {
  name: string
  picture: string
  desc: string
}

interface EntryModel extends BaseModel {
  app_id: AppModel['id']
  name: string
  url: string
  type: number
  client: string
  oidc_config: {
    secret: string
    redirect: string
    userFlag: string
    attribute: AttributeMapModel[]
  }
  saml_config: {
    key: string
    keyPass: string
    cer: string
    spMetadata: string
    spLoginExpire: number
    spNameid: string
    userFlag: string
    attribute: AttributeMapModel[]
  }
}

interface UserModel extends BaseModel {
  channel: number
  openid: string
  email: string
  phone: string
  name: string
  nickname: string
  picture: string
  password: string
  role: number
}
