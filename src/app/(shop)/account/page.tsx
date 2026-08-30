'use client'

import { useShop } from '../../../App'
import { AccountPage } from '../../../views/AccountPage'

export default function Page() {
  const { customer, signOutShop } = useShop()
  return <AccountPage customer={customer} onLogout={signOutShop} />
}
