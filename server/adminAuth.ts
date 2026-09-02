import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const TOKEN_HOURS = 8

export function getAdminKey(): string {
  const key = process.env.ADMIN_KEY?.trim()
  return key && key.length > 0 ? key : 'rangrani-studio'
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  return secret && secret.length > 0 ? secret : `${getAdminKey()}-jwt`
}

export function signAdminToken(): string {
  return jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: `${TOKEN_HOURS}h` })
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : ''

  if (!token) {
    res.status(401).json({ error: 'Admin sign-in required' })
    return
  }

  try {
    const payload = jwt.verify(token, getJwtSecret())
    if (typeof payload === 'string' || payload.role !== 'admin') {
      res.status(401).json({ error: 'Admin sign-in required' })
      return
    }
    next()
  } catch {
    res.status(401).json({ error: 'Admin session expired. Sign in again.' })
  }
}
