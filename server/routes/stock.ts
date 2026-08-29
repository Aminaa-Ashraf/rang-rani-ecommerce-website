import { Router } from 'express'
import { isStockCommitInput } from '../../shared/types.ts'
import { OutOfStockError, ProductNotFoundError, type ProductService } from '../productService.ts'

export function createStockRouter(service: ProductService): Router {
  const router = Router()

  router.post('/commit', async (req, res, next) => {
    try {
      if (!isStockCommitInput(req.body)) {
        res.status(400).json({ error: 'Send cart items with productId and quantity' })
        return
      }

      const data = await service.commitStock(req.body.items)
      res.status(200).json({ data })
    } catch (error) {
      if (error instanceof OutOfStockError || error instanceof ProductNotFoundError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      next(error)
    }
  })

  router.post('/release', async (req, res, next) => {
    try {
      if (!isStockCommitInput(req.body)) {
        res.status(400).json({ error: 'Send cart items with productId and quantity' })
        return
      }

      const data = await service.releaseStock(req.body.items)
      res.status(200).json({ data })
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
