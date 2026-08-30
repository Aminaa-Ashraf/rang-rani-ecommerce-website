import type { Product } from '../shared/types.ts'
import catalog from './data/products.json'
import type { ProductStore } from './store.ts'

export async function seedProducts(store: ProductStore): Promise<void> {
  const products = catalog as Omit<Product, 'id'>[]
  const inserted = await store.seedIfEmpty(
    products.map(({ title, price, description, category, image, rating, stock }) => ({
      title,
      price,
      description,
      category,
      image,
      rating,
      stock: Number.isInteger(stock) && stock >= 0 ? stock : 8,
    })),
  )

  if (inserted > 0) {
    console.log(`MongoDB seeded: ${inserted} products`)
  }
}
