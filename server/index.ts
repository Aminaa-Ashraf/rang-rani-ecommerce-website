import 'dotenv/config'
import { createApp } from './app.ts'
import { connectDb } from './db.ts'
import { CustomerStore } from './customerStore.ts'
import { OrderStore } from './orderStore.ts'
import { ProductService } from './productService.ts'
import { seedProducts } from './seed.ts'
import { ProductStore } from './store.ts'

const PORT = 3001

await connectDb()
console.log('MongoDB connected')

const store = new ProductStore()
await seedProducts(store)
const filled = await store.backfillStock()
if (filled > 0) {
  console.log(`Stock filled on ${filled} older products`)
}

const service = new ProductService(store)
const customers = new CustomerStore()
await customers.ensureIndexes()
const orders = new OrderStore()
const app = createApp(service, customers, orders)

app.listen(PORT, () => {
  console.log(`API ready: http://localhost:${PORT}`)
  console.log('GET    /api/products')
  console.log('GET    /api/products/:id')
  console.log('POST   /api/products')
  console.log('PUT    /api/products/:id')
  console.log('DELETE /api/products/:id')
})
