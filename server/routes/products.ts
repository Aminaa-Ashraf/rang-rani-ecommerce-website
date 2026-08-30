import { Router } from 'express'
import { isCreateProductInput, isProductId, isStockCount } from '../../shared/types.ts'
import { requireAdmin } from '../adminAuth.ts'
import { ProductNotFoundError, type ProductService } from '../productService.ts'

function readProductId(value: unknown): ProductIdError | { id: string } {
  const id = Array.isArray(value) ? value[0] : value
  if (!isProductId(id)) {
    return { error: 'Product id must be a 24-character MongoDB id' }
  }

  return { id }
}

interface ProductIdError {
  error: string
}

export function createProductRouter(service: ProductService): Router {
  const router = Router()

  router.get('/', async (_req, res, next) => {
    try {
      const data = await service.list()
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.get('/categories', async (_req, res, next) => {
    try {
      const data = await service.categories()
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const parsed = readProductId(req.params.id)
      if ('error' in parsed) {
        res.status(400).json(parsed)
        return
      }

      const data = await service.getById(parsed.id)
      res.status(200).json({ data })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }

      next(error)
    }
  })

  router.post('/', requireAdmin, async (req, res, next) => {
    try {
      if (!isCreateProductInput(req.body)) {
        res.status(400).json({
          error: 'Send title, price, description, category, image, and stock',
        })
        return
      }

      const data = await service.create(req.body)
      res.status(201).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
      const parsed = readProductId(req.params.id)
      if ('error' in parsed) {
        res.status(400).json(parsed)
        return
      }

      if (!isCreateProductInput(req.body)) {
        res.status(400).json({
          error: 'Send title, price, description, category, image, and stock',
        })
        return
      }

      const data = await service.update(parsed.id, req.body)
      res.status(200).json({ data })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }

      next(error)
    }
  })

  router.patch('/:id/stock', requireAdmin, async (req, res, next) => {
    try {
      const parsed = readProductId(req.params.id)
      if ('error' in parsed) {
        res.status(400).json(parsed)
        return
      }

      const stock = (req.body as { stock?: unknown }).stock
      if (!isStockCount(stock)) {
        res.status(400).json({ error: 'Send a stock count of 0 or more' })
        return
      }

      const data = await service.setStock(parsed.id, stock)
      res.status(200).json({ data })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }

      next(error)
    }
  })

  router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
      const parsed = readProductId(req.params.id)
      if ('error' in parsed) {
        res.status(400).json(parsed)
        return
      }

      await service.remove(parsed.id)
      res.status(200).json({ data: { deleted: true } })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }

      next(error)
    }
  })

  return router
}
