import type { NextFunction, Request, Response } from 'express'

export function getAdminKey(): string {
  const key = process.env.ADMIN_KEY?.trim()
  return key && key.length > 0 ? key : 'rangrani-studio'
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const sent = req.header('x-admin-key')
  if (!sent || sent !== getAdminKey()) {
    res.status(401).json({ error: 'Admin sign-in required' })
    return
  }

  next()
}
