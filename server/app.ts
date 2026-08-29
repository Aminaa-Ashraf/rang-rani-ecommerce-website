import cors from 'cors'
import express from 'express'
import { getAdminKey } from './adminAuth.ts'
import type { CustomerStore } from './customerStore.ts'
import type { OrderStore } from './orderStore.ts'
import { createProductRouter } from './routes/products.ts'
import { createShopAuthRouter } from './routes/shopAuth.ts'
import { createStockRouter } from './routes/stock.ts'
import type { ProductService } from './productService.ts'

export function createApp(
  service: ProductService,
  customers: CustomerStore,
  orders: OrderStore,
): express.Express {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ data: { ok: true } })
  })

  app.post('/api/admin/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (password !== getAdminKey()) {
      res.status(401).json({ error: 'Wrong studio password' })
      return
    }

    res.status(200).json({ data: { ok: true } })
  })

  app.use('/api/products', createProductRouter(service))
  app.use('/api/stock', createStockRouter(service))
  app.use('/api', createShopAuthRouter(customers, orders, service))

  app.use((_req, res) => {
    res.status(404).json({ error: 'This API route does not exist' })
  })

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong on the server' })
  })

  return app
}
