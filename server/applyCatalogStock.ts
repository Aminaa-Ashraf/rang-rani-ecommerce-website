import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { isStockCount } from '../shared/types.ts'
import { connectDb } from './db.ts'
import { ProductStore } from './store.ts'

const filePath = path.join(import.meta.dirname, 'data', 'products.json')
const raw = await readFile(filePath, 'utf8')
const products = JSON.parse(raw) as { title: string; stock?: number }[]

await connectDb()
const updated = await new ProductStore().applyStockByTitle(
  products
    .filter((product) => isStockCount(product.stock))
    .map((product) => ({ title: product.title, stock: product.stock as number })),
)

console.log(`Stock updated on ${updated} products`)
process.exit(0)
