import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Product } from '../shared/types.ts'
import { connectDb } from './db.ts'
import { ProductStore } from './store.ts'

const filePath = path.join(import.meta.dirname, 'data', 'products.json')
const raw = await readFile(filePath, 'utf8')
const products = JSON.parse(raw) as Product[]

await connectDb()
const inserted = await new ProductStore().replaceAll(
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

console.log(`Catalog replaced: ${inserted} products`)
process.exit(0)
