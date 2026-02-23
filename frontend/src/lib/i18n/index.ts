import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import { DEFULT_LANG } from '@/config'

import { langs } from './handle'

i18n.use(initReactI18next).init({
  resources: Object.entries(langs).reduce((obj: Resource, [key, value]) => {
    obj[key] = { translation: value }
    return obj
  }, {}),

  fallbackLng: DEFULT_LANG,

  debug: false,

  interpolation: {
    escapeValue: false,
  },
})

export default i18n
