import { Router } from 'express'
import { isEmail } from '../../shared/types.ts'
import type { OrderEmailInput } from '../../shared/orderEmail.ts'
import { sendOrderNotice, sendStudioNote } from '../orderMail.ts'
import type { ReviewStore } from '../reviewStore.ts'

function readNotice(body: unknown): OrderEmailInput | null {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const row = body as Record<string, unknown>
  if (
    typeof row.name !== 'string' ||
    typeof row.email !== 'string' ||
    !isEmail(row.email) ||
    typeof row.phone !== 'string' ||
    typeof row.city !== 'string' ||
    typeof row.address !== 'string' ||
    typeof row.total !== 'number' ||
    typeof row.viewUrl !== 'string' ||
    !Array.isArray(row.items) ||
    row.items.length === 0
  ) {
    return null
  }

  const items = row.items.flatMap((item) => {
    if (typeof item !== 'object' || item === null) {
      return []
    }
    const line = item as Record<string, unknown>
    if (
      typeof line.productId !== 'string' ||
      typeof line.title !== 'string' ||
      typeof line.price !== 'number' ||
      typeof line.quantity !== 'number'
    ) {
      return []
    }
    return [
      {
        productId: line.productId,
        title: line.title,
        price: line.price,
        quantity: line.quantity,
        image: typeof line.image === 'string' ? line.image : '',
      },
    ]
  })

  if (items.length === 0) {
    return null
  }

  return {
    name: row.name.trim(),
    email: row.email.trim().toLowerCase(),
    phone: row.phone.trim(),
    city: row.city.trim(),
    address: row.address.trim(),
    items,
    total: row.total,
    viewUrl: row.viewUrl.trim(),
  }
}

export function createNotifyRouter(reviews?: ReviewStore): Router {
  const router = Router()

  router.post('/notify-order', async (req, res, next) => {
    try {
      const input = readNotice(req.body)
      if (!input) {
        res.status(400).json({ error: 'Send a complete order for the thank-you email' })
        return
      }

      const data = await sendOrderNotice(input)
      if (reviews) {
        await reviews.rememberOrder(input.name, input.email)
      }
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  router.post('/contact', async (req, res, next) => {
    try {
      const body = req.body as Record<string, unknown>
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      const message = typeof body.message === 'string' ? body.message.trim() : ''

      if (!name || !isEmail(email) || message.length < 4) {
        res.status(400).json({ error: 'Add your name, email, and a short note' })
        return
      }

      const data = await sendStudioNote({ name, email, message })
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  })

  return router
}
