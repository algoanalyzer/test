import { configureStore } from "@reduxjs/toolkit"
import userDataReducer from './features/userData/userDataSlice'

export const userStore = configureStore({
  reducer: {
    userData: userDataReducer
  },
  devTools: true
})

// Infer the type of userStore.
export type AppStore = typeof userStore
// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']