import { isApiFail } from '../../shared/types'
import type {
  ApiSuccess,
  CreateProductInput,
  Customer,
  CustomerAuth,
  LoginInput,
  PlaceOrderInput,
  Product,
  ProductCategory,
  ProductId,
  RegisterInput,
  ShopOrder,
} from '../../shared/types'
import { getAdminKey } from '../lib/adminSession'
import { getCustomerToken } from '../lib/customerSession'

async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const adminKey = getAdminKey()
  const customerToken = getCustomerToken()
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
      ...(customerToken ? { 'x-customer-token': customerToken } : {}),
      ...options?.headers,
    },
    ...options,
  })

  const raw = await response.text()
  let body: unknown
  try {
    body = raw ? JSON.parse(raw) : null
  } catch {
    throw new Error('The shop API did not respond. Check Atlas Network Access, then refresh.')
  }

  if (!response.ok || isApiFail(body)) {
    const message = isApiFail(body) ? body.error : `Request failed (${response.status})`
    throw new Error(message)
  }

  return body as T
}

export class ProductApi {
  private readonly baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  public async getProducts(): Promise<Product[]> {
    const result = await fetchData<ApiSuccess<Product[]>>(`${this.baseUrl}/products`)
    return result.data
  }

  public async getProduct(id: ProductId): Promise<Product> {
    const result = await fetchData<ApiSuccess<Product>>(`${this.baseUrl}/products/${id}`)
    return result.data
  }

  public async getCategories(): Promise<ProductCategory[]> {
    const result = await fetchData<ApiSuccess<ProductCategory[]>>(
      `${this.baseUrl}/products/categories`,
    )
    return result.data
  }

  public async login(password: string): Promise<void> {
    await fetchData<ApiSuccess<{ ok: boolean }>>(`${this.baseUrl}/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  public async createProduct(input: CreateProductInput): Promise<Product> {
    const result = await fetchData<ApiSuccess<Product>>(`${this.baseUrl}/products`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return result.data
  }

  public async updateProduct(id: ProductId, input: CreateProductInput): Promise<Product> {
    const result = await fetchData<ApiSuccess<Product>>(`${this.baseUrl}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return result.data
  }

  public async deleteProduct(id: ProductId): Promise<void> {
    await fetchData<ApiSuccess<{ deleted: boolean }>>(`${this.baseUrl}/products/${id}`, {
      method: 'DELETE',
    })
  }

  public async setStock(id: ProductId, stock: number): Promise<Product> {
    const result = await fetchData<ApiSuccess<Product>>(`${this.baseUrl}/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    })
    return result.data
  }

  public async commitStock(items: { productId: string; quantity: number }[]): Promise<Product[]> {
    const result = await fetchData<ApiSuccess<Product[]>>(`${this.baseUrl}/stock/commit`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
    return result.data
  }

  public async releaseStock(items: { productId: string; quantity: number }[]): Promise<Product[]> {
    const result = await fetchData<ApiSuccess<Product[]>>(`${this.baseUrl}/stock/release`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
    return result.data
  }

  public async register(input: RegisterInput): Promise<CustomerAuth> {
    const result = await fetchData<ApiSuccess<CustomerAuth>>(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return result.data
  }

  public async customerLogin(input: LoginInput): Promise<CustomerAuth> {
    const result = await fetchData<ApiSuccess<CustomerAuth>>(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return result.data
  }

  public async customerLogout(): Promise<void> {
    await fetchData<ApiSuccess<{ ok: boolean }>>(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
    })
  }

  public async getMe(): Promise<Customer> {
    const result = await fetchData<ApiSuccess<Customer>>(`${this.baseUrl}/me`)
    return result.data
  }

  public async placeOrder(input: PlaceOrderInput): Promise<ShopOrder> {
    const result = await fetchData<ApiSuccess<ShopOrder>>(`${this.baseUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return result.data
  }

  public async getOrders(): Promise<ShopOrder[]> {
    const result = await fetchData<ApiSuccess<ShopOrder[]>>(`${this.baseUrl}/orders`)
    return result.data
  }

  public async rememberOrderEmail(input: { name: string; email: string }): Promise<void> {
    await fetchData<ApiSuccess<{ ok: boolean }>>(`${this.baseUrl}/order-email`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  public async sendReview(input: { name: string; email: string; text: string }): Promise<void> {
    await fetchData<ApiSuccess<{ id: string }>>(`${this.baseUrl}/reviews`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  public async getReviews(): Promise<{ id: string; name: string; email: string; text: string; createdAt: string }[]> {
    const result = await fetchData<
      ApiSuccess<{ id: string; name: string; email: string; text: string; createdAt: string }[]>
    >(`${this.baseUrl}/reviews`)
    return result.data
  }

  public async sendStudioNote(input: { name: string; email: string; message: string }): Promise<void> {
    await fetchData<ApiSuccess<{ sent: boolean; via: string }>>(`${this.baseUrl}/contact`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  public async sendOrderEmail(input: {
    name: string
    email: string
    phone: string
    city: string
    address: string
    items: { productId: string; title: string; price: number; quantity: number; image: string }[]
    total: number
    viewUrl: string
  }): Promise<void> {
    await fetchData<ApiSuccess<{ sent: boolean; via: string }>>(`${this.baseUrl}/notify-order`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }
}
