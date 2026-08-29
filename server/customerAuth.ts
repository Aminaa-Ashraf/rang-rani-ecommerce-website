import type { NextFunction, Request, Response } from 'express'
import type { Customer } from '../shared/types.ts'
import type { CustomerStore } from './customerStore.ts'

export interface CustomerRequest extends Request {
  customer?: Customer
  customerToken?: string
}

export function requireCustomer(store: CustomerStore) {
  return async (req: CustomerRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('x-customer-token')
    if (!token) {
      res.status(401).json({ error: 'Sign in to continue' })
      return
    }

    try {
      const customer = await store.findByToken(token)
      if (!customer) {
        res.status(401).json({ error: 'Sign in to continue' })
        return
      }

      req.customer = customer
      req.customerToken = token
      next()
    } catch (error) {
      next(error)
    }
  }
}
