import { Router } from 'express'
import { isLoginInput, isPlaceOrderInput, isRegisterInput } from '../../shared/types.ts'
import { requireCustomer, type CustomerRequest } from '../customerAuth.ts'
import { AuthFailedError, CustomerStore, EmailTakenError } from '../customerStore.ts'
import type { OrderStore } from '../orderStore.ts'
import { OutOfStockError, ProductNotFoundError, type ProductService } from '../productService.ts'

export function createShopAuthRouter(
  customers: CustomerStore,
  orders: OrderStore,
  products: ProductService,
): Router {
  const router = Router()
  const auth = requireCustomer(customers)

  router.post('/auth/register', async (req, res, next) => {
    try {
      if (!isRegisterInput(req.body)) {
        res.status(400).json({ error: 'Send name, email, phone, and a password of 6+ characters' })
        return
      }

      const data = await customers.register(req.body)
      res.status(201).json({ data })
    } catch (error) {
      if (error instanceof EmailTakenError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      next(error)
    }
  })

  router.post('/auth/login', async (req, res, next) => {
    try {
      if (!isLoginInput(req.body)) {
        res.status(400).json({ error: 'Send email and password' })
        return
      }

      const data = await customers.login(req.body.email, req.body.password)
      res.status(200).json({ data })
    } catch (error) {
      if (error instanceof AuthFailedError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      next(error)
    }
  })

  router.post('/auth/logout', auth, async (req: CustomerRequest, res, next) => {
    try {
      if (req.customerToken) {
        await customers.logout(req.customerToken)
      }
      res.status(200).json({ data: { ok: true } })
    } catch (error) {
      next(error)
    }
  })

  router.get('/me', auth, (req: CustomerRequest, res) => {
    res.status(200).json({ data: req.customer })
  })

  router.patch('/me', auth, async (req: CustomerRequest, res, next) => {
    try {
      if (!req.customer) {
        res.status(401).json({ error: 'Sign in to continue' })
        return
      }

      const body = req.body as Record<string, unknown>
      const updated = await customers.updateContact(req.customer.id, {
        name: typeof body.name === 'string' ? body.name : undefined,
        phone: typeof body.phone === 'string' ? body.phone : undefined,
        city: typeof body.city === 'string' ? body.city : undefined,
        address: typeof body.address === 'string' ? body.address : undefined,
      })
      res.status(200).json({ data: updated })
    } catch (error) {
      next(error)
    }
  })

  router.get('/orders', auth, async (req: CustomerRequest, res, next) => {
    try {
      if (!req.customer) {
        res.status(401).json({ error: 'Sign in to continue' })
        return
      }

      const data = await orders.listForCustomer(req.customer.id)
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.post('/orders', auth, async (req: CustomerRequest, res, next) => {
    try {
      if (!req.customer) {
        res.status(401).json({ error: 'Sign in to continue' })
        return
      }

      if (!isPlaceOrderInput(req.body)) {
        res.status(400).json({ error: 'Send city, address, and cart items' })
        return
      }

      const lines = []
      for (const item of req.body.items) {
        const product = await products.getById(item.productId)
        lines.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
        })
      }

      const total = lines.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const city = req.body.city.trim()
      const address = req.body.address.trim()
      await products.commitStock(req.body.items)
      await customers.updateContact(req.customer.id, { city, address })
      const data = await orders.create({
        customerId: req.customer.id,
        items: lines,
        total,
        city,
        address,
      })
      res.status(201).json({ data })
    } catch (error) {
      if (error instanceof ProductNotFoundError || error instanceof OutOfStockError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      next(error)
    }
  })

  return router
}
