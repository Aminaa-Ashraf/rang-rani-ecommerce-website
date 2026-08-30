import type { CartItem } from '../../shared/types'

const STORAGE_KEY = 'rangrani-cart'

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map((item) => ({
      ...item,
      stock: Number.isInteger(item.stock) && item.stock >= 0 ? item.stock : 0,
    }))
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
