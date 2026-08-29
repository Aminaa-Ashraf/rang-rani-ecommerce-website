import type { Customer, CustomerAuth } from '../../shared/types.ts'

const STORAGE_KEY = 'rangrani-customer'

export function getCustomerAuth(): CustomerAuth | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as CustomerAuth
  } catch {
    return null
  }
}

export function getCustomerToken(): string | null {
  return getCustomerAuth()?.token ?? null
}

export function setCustomerAuth(auth: CustomerAuth): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearCustomerAuth(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function getSavedCustomer(): Customer | null {
  return getCustomerAuth()?.customer ?? null
}
