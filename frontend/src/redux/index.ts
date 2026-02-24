import { useDispatch as useOrgDispatch, useSelector as useOrgSelector, type TypedUseSelectorHook } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import global from './reducer/global'
import user from './reducer/user'

export const store = configureStore({
  reducer: {
    global: persistReducer({ key: 'app-store', storage }, global),
    user,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 忽略 redux-persist dispatch 的所有 action 类型：https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useDispatch: () => AppDispatch = useOrgDispatch

export const useSelector: TypedUseSelectorHook<RootState> = useOrgSelector
