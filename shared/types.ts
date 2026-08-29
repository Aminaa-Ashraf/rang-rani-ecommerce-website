export type ProductId = string
export type Price = number
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

export enum ProductCategory {
  Beaded = 'beaded',
  Kundan = 'kundan',
  Charm = 'charm',
  Bridal = 'bridal',
  Friendship = 'friendship',
  GoldPlated = 'gold plated',
}

export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: ProductId
  title: string
  price: Price
  description: string
  category: ProductCategory
  image: string
  rating: ProductRating
  stock: number
}

export interface ApiSuccess<T> {
  data: T
}

export interface ApiFail {
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFail
export type CartItem = Product & { quantity: number }
export type CreateProductInput = Omit<Product, 'id' | 'rating'>

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  address: string
}

export interface CustomerAuth {
  token: string
  customer: Customer
}

export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface ShopOrder {
  id: string
  items: OrderItem[]
  total: number
  city: string
  address: string
  createdAt: string
}

export interface PlaceOrderInput {
  city: string
  address: string
  items: { productId: string; quantity: number }[]
}
export type ProductCard = Pick<Product, 'id' | 'title' | 'price' | 'image' | 'category'>
export type ProductPatch = Partial<CreateProductInput>

export function isApiFail(value: unknown): value is ApiFail {
  return typeof value === 'object' && value !== null && 'error' in value
}

export function isProductId(value: unknown): value is ProductId {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value)
}

export function isProductCategory(value: unknown): value is ProductCategory {
  return Object.values(ProductCategory).includes(value as ProductCategory)
}

export const LOW_STOCK = 3

export type StockLevel = 'in' | 'low' | 'out'

export function isStockCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) {
    return 'out'
  }
  if (stock <= LOW_STOCK) {
    return 'low'
  }
  return 'in'
}

export function stockLabel(stock: number): string {
  if (stock <= 0) {
    return 'Out of stock'
  }
  if (stock === 1) {
    return 'Only 1 left'
  }
  if (stock <= LOW_STOCK) {
    return `Only ${stock} left`
  }
  return `${stock} in stock`
}

export interface StockLine {
  productId: string
  quantity: number
}

export function isStockLine(value: unknown): value is StockLine {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const row = value as Record<string, unknown>
  return (
    typeof row.productId === 'string' &&
    row.productId.trim().length > 0 &&
    typeof row.quantity === 'number' &&
    Number.isInteger(row.quantity) &&
    row.quantity > 0
  )
}

export function isStockCommitInput(value: unknown): value is { items: StockLine[] } {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const body = value as Record<string, unknown>
  return Array.isArray(body.items) && body.items.length > 0 && body.items.every(isStockLine)
}

export function isCreateProductInput(value: unknown): value is CreateProductInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>

  return (
    typeof body.title === 'string' &&
    body.title.trim().length > 0 &&
    typeof body.price === 'number' &&
    Number.isFinite(body.price) &&
    body.price > 0 &&
    typeof body.description === 'string' &&
    body.description.trim().length > 0 &&
    isProductCategory(body.category) &&
    typeof body.image === 'string' &&
    body.image.trim().length > 0 &&
    isStockCount(body.stock)
  )
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isRegisterInput(value: unknown): value is RegisterInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>
  return (
    typeof body.name === 'string' &&
    body.name.trim().length >= 2 &&
    typeof body.email === 'string' &&
    isEmail(body.email) &&
    typeof body.phone === 'string' &&
    body.phone.trim().length >= 10 &&
    typeof body.password === 'string' &&
    body.password.length >= 6
  )
}

export function isLoginInput(value: unknown): value is LoginInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>
  return typeof body.email === 'string' && isEmail(body.email) && typeof body.password === 'string'
}

export function isPlaceOrderInput(value: unknown): value is PlaceOrderInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>
  return (
    typeof body.city === 'string' &&
    body.city.trim().length > 0 &&
    typeof body.address === 'string' &&
    body.address.trim().length > 0 &&
    Array.isArray(body.items) &&
    body.items.length > 0 &&
    body.items.every(isStockLine)
  )
}
