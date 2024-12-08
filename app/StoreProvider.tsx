"use client" // Client-side Component to allow for store.

import { Provider } from 'react-redux'
import { userStore } from '../lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={userStore}>
      {children}
    </Provider>
  )
}
