import { ProductCategory } from '../shared/types.ts'
import type { CreateProductInput, Product, ProductId, StockLine } from '../shared/types.ts'
import type { ProductStore } from './store.ts'

export class ProductNotFoundError extends Error {
  public readonly statusCode = 404

  constructor(id: ProductId) {
    super(`Product ${id} was not found`)
    this.name = 'ProductNotFoundError'
  }
}

export class OutOfStockError extends Error {
  public readonly statusCode = 409

  constructor(titles: string[]) {
    super(
      titles.length === 1
        ? `${titles[0]} is out of stock`
        : `Not enough stock for ${titles.join(', ')}`,
    )
    this.name = 'OutOfStockError'
  }
}

export class ProductService {
  constructor(private readonly store: ProductStore) {}

  public async list(): Promise<Product[]> {
    return this.store.findAll()
  }

  public async getById(id: ProductId): Promise<Product> {
    const product = await this.store.findById(id)

    if (!product) {
      throw new ProductNotFoundError(id)
    }

    return product
  }

  public async categories(): Promise<ProductCategory[]> {
    const products = await this.store.findAll()
    const order = Object.values(ProductCategory)
    return order.filter((category) => products.some((product) => product.category === category))
  }

  public async create(input: CreateProductInput): Promise<Product> {
    return this.store.insert(input)
  }

  public async update(id: ProductId, input: CreateProductInput): Promise<Product> {
    const product = await this.store.update(id, input)

    if (!product) {
      throw new ProductNotFoundError(id)
    }

    return product
  }

  public async remove(id: ProductId): Promise<void> {
    const deleted = await this.store.remove(id)

    if (!deleted) {
      throw new ProductNotFoundError(id)
    }
  }

  public async setStock(id: ProductId, stock: number): Promise<Product> {
    const product = await this.store.setStock(id, stock)

    if (!product) {
      throw new ProductNotFoundError(id)
    }

    return product
  }

  public async commitStock(items: StockLine[]): Promise<Product[]> {
    const applied: StockLine[] = []
    const short: string[] = []

    for (const item of items) {
      const current = await this.getById(item.productId)
      const next = await this.store.changeStock(item.productId, -item.quantity)
      if (!next) {
        short.push(current.title)
        continue
      }
      applied.push(item)
    }

    if (short.length > 0) {
      await this.releaseStock(applied)
      throw new OutOfStockError(short)
    }

    return this.list()
  }

  public async releaseStock(items: StockLine[]): Promise<Product[]> {
    for (const item of items) {
      await this.store.changeStock(item.productId, item.quantity)
    }
    return this.list()
  }
}
