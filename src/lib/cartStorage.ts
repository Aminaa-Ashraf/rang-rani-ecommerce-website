import type { CartItem } from '../../shared/types.ts'

const STORAGE_KEY = 'rangrani-cart'

export function loadCart(): CartItem[] {
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
