import type { CartItem } from '../../shared/types'

const key = 'rang-rani-receipt'

export interface OrderReceipt {
  name: string
  city: string
  address: string
  items: CartItem[]
  total: number
}

export function saveReceipt(receipt: OrderReceipt): void {
  sessionStorage.setItem(key, JSON.stringify(receipt))
}

export function loadReceipt(): OrderReceipt | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as OrderReceipt
  } catch {
    return null
  }
}

export function clearReceipt(): void {
  sessionStorage.removeItem(key)
}
