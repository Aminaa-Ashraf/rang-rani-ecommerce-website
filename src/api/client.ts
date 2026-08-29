import { isApiFail } from '../../shared/types.ts'
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
} from '../../shared/types.ts'
import { getAdminKey } from '../lib/adminSession.ts'
import { getCustomerToken } from '../lib/customerSession.ts'

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

  const body: unknown = await response.json()

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
}
