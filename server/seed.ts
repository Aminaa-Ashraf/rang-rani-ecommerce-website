import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Product } from '../shared/types.ts'
import type { ProductStore } from './store.ts'

export async function seedProducts(store: ProductStore): Promise<void> {
  const filePath = path.join(import.meta.dirname, 'data', 'products.json')
  const raw = await readFile(filePath, 'utf8')
  const products = JSON.parse(raw) as Product[]
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
