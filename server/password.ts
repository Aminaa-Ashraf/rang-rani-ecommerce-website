import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function checkPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) {
    return false
  }

  const next = scryptSync(password, salt, 64)
  const current = Buffer.from(hash, 'hex')
  return current.length === next.length && timingSafeEqual(current, next)
}

export function createToken(): string {
  return randomBytes(32).toString('hex')
}
