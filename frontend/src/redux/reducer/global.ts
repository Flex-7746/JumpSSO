import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { IS_DEV, DEFULT_LANG } from '@/config'

export interface StateModel {
  token: string
  env: 'dev' | 'prod'
  lang: string
}

const initialState: StateModel = {
  token: '',
  env: IS_DEV ? 'dev' : 'prod',
  lang: DEFULT_LANG,
}

export const slice = createSlice({
  name: 'global',

  initialState,

  reducers: {
    update(state, action: PayloadAction<Partial<StateModel>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { update } = slice.actions

export default slice.reducer
