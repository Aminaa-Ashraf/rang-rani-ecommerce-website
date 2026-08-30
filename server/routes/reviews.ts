import { Router } from 'express'
import { isEmail } from '../../shared/types.ts'
import { requireAdmin } from '../adminAuth.ts'
import { sendStudioNote } from '../orderMail.ts'
import type { ReviewStore } from '../reviewStore.ts'

export function createReviewRouter(reviews: ReviewStore): Router {
  const router = Router()

  router.post('/order-email', async (req, res, next) => {
    try {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
      if (!name || !isEmail(email)) {
        res.status(400).json({ error: 'Name and order email are required' })
        return
      }
      await reviews.rememberOrder(name, email)
      res.status(200).json({ data: { ok: true } })
    } catch (error) {
      next(error)
    }
  })

  router.post('/reviews', async (req, res, next) => {
    try {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
      const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''

      if (!name || !isEmail(email) || text.length < 4) {
        res.status(400).json({ error: 'Add your name, email, and review' })
        return
      }

      if (await reviews.findReview(email)) {
        res.status(400).json({ error: 'You already sent a review' })
        return
      }

      const data = await reviews.addReview(name, email, text)
      try {
        await sendStudioNote({
          name,
          email,
          message: `Review\n\n${text}`,
        })
      } catch {
        // review is saved even if studio mail fails
      }
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.get('/reviews', requireAdmin, async (_req, res, next) => {
    try {
      res.status(200).json({ data: await reviews.list() })
    } catch (error) {
      next(error)
    }
  })

  return router
}
