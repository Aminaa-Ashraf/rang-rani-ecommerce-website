'use client'

import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

interface LinkProps {
  to: string
  className?: string
  children?: ReactNode
  onClick?: () => void
}

export function Link({ to, className, children, onClick }: LinkProps) {
  return (
    <NextLink href={to} className={className} onClick={onClick}>
      {children}
    </NextLink>
  )
}

interface NavLinkProps extends LinkProps {
  end?: boolean
}

function linkIsActive(pathname: string, to: string, end?: boolean): boolean {
  if (end) {
    return pathname === to
  }
  if (to === '/') {
    return true
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function NavLink({ to, end, className, children, onClick }: NavLinkProps) {
  const pathname = usePathname() ?? ''
  const active = linkIsActive(pathname, to, end)
  const classes = [className, active ? 'active' : ''].filter(Boolean).join(' ')

  return (
    <NextLink href={to} className={classes || undefined} onClick={onClick}>
      {children}
    </NextLink>
  )
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useRouter()

  useEffect(() => {
    if (replace) {
      router.replace(to)
      return
    }
    router.push(to)
  }, [replace, router, to])

  return null
}
