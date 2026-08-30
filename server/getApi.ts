import type { Express } from 'express'
import { createApp } from './app'
import { connectDb } from './db'
import { CustomerStore } from './customerStore'
import { OrderStore } from './orderStore'
import { ProductService } from './productService'
import { ReviewStore } from './reviewStore'
import { seedProducts } from './seed'
import { ProductStore } from './store'

let ready: Promise<Express> | null = null

export function getApi(): Promise<Express> {
  if (!ready) {
    ready = (async () => {
      await connectDb()
      const store = new ProductStore()
      await seedProducts(store)
      await store.backfillStock()
      const customers = new CustomerStore()
      await customers.ensureIndexes()
      return createApp(new ProductService(store), customers, new OrderStore(), new ReviewStore())
    })()
  }

  return ready
}
