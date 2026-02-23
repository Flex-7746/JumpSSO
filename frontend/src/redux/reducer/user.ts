import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type StateModel = UserModel

const initialState: UserModel = {
  id: 0,
  channel: 1,
  openid: '',
  email: '',
  phone: '',
  name: '',
  nickname: '',
  picture: '',
  password: '',
  role: 1,
  update_date: '',
  create_date: '',
}

const slice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    update(state, action: PayloadAction<Partial<StateModel>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { update } = slice.actions

export default slice.reducer
