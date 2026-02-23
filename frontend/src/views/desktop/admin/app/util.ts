export const getAttributeDef = (): AttributeMapModel[] => [
  { left: 'email', right: 'email' },
  { left: 'phone', right: 'phone' },
]

export const getOidcDef = (): EntryModel['oidc_config'] => ({
  secret: '',
  redirect: '',
  userFlag: '__EMAIL__',
  attribute: getAttributeDef(),
})

export const getOidcConfig = (entry: EntryModel) => {
  const def = getOidcDef()

  try {
    const custom = JSON.parse(entry.oidc_config as unknown as string)
    return { ...def, ...custom }
  } catch {
    return def
  }
}

export const getSamlDef = (): EntryModel['saml_config'] => ({
  key: '',
  keyPass: '',
  cer: '',
  spMetadata: '',
  spNameid: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
  spLoginExpire: 10080,
  userFlag: '__EMAIL__',
  attribute: getAttributeDef(),
})

export const getSamlConfig = (entry: EntryModel) => {
  const def = getSamlDef()

  try {
    const custom = JSON.parse(entry.saml_config as unknown as string)
    return { ...def, ...custom }
  } catch {
    return def
  }
}

export const getEntryDef = (): EntryModel => ({
  app_id: 0,
  id: 0,
  name: '',
  url: '',
  type: 1,
  client: '',
  oidc_config: getOidcDef(),
  saml_config: getSamlDef(),
  create_date: '',
  update_date: '',
})

export const getAppDef = (): AppModel => ({ id: 0, name: '', picture: '', desc: '', create_date: '', update_date: '' })
