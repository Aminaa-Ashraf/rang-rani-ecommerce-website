'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Product, ProductCategory } from '../../shared/types'
import { NavLink } from '../lib/nav'
import {
  productMatchesSearch,
  shopCategoryLabel,
  shopCollections,
  textMatchesSearch,
} from '../lib/shopLabels'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/faq', label: 'FAQ', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

type SearchHit =
  | { kind: 'collection'; id: ProductCategory; label: string }
  | { kind: 'product'; id: string; label: string }

interface NavbarProps {
  search: string
  products: Product[]
  cartCount: number
  onSearchChange: (value: string) => void
  onPickCollection: (category: ProductCategory) => void
  onPickProduct: (id: string) => void
  cartLocked?: boolean
  onOpenCart: () => void
}

export function Navbar({
  search,
  products,
  cartCount,
  onSearchChange,
  onPickCollection,
  onPickProduct,
  cartLocked = false,
  onOpenCart,
}: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const params = useSearchParams()
  const boxRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const hits = useMemo<SearchHit[]>(() => {
    const query = search.trim()
    if (query.length < 2) {
      return []
    }

    const collections: SearchHit[] = shopCollections
      .filter((category) => textMatchesSearch(`${category} ${shopCategoryLabel[category]}`, query))
      .map((category) => ({
        kind: 'collection',
        id: category,
        label: shopCategoryLabel[category],
      }))

    const pieces: SearchHit[] = products
      .filter((product) => productMatchesSearch(product, query))
      .slice(0, 6)
      .map((product) => ({
        kind: 'product',
        id: product.id,
        label: product.title,
      }))

    return [...collections, ...pieces]
  }, [products, search])

  useEffect(() => {
    setActive(0)
  }, [search])

  useEffect(() => {
    function onPointer(event: MouseEvent): void {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [])

  function goShop(): void {
    if (pathname !== '/shop' || params?.get('category')) {
      router.push('/shop')
    }
    setOpen(false)
  }

  function choose(hit: SearchHit): void {
    if (hit.kind === 'collection') {
      onPickCollection(hit.id)
      router.push(`/shop?category=${hit.id}`)
    } else {
      onPickProduct(hit.id)
      if (pathname !== '/shop') {
        router.push('/shop')
      }
    }
    setOpen(false)
  }

  function submitSearch(): void {
    const hit = hits[active] ?? hits[0]
    if (hit) {
      choose(hit)
      return
    }
    goShop()
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/">
          <img className="brand-logo" src="/logo.svg?v=lahore" alt="" />
          <span className="brand-name">Rang Rani</span>
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <form
            ref={boxRef}
            className="nav-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              submitSearch()
            }}
          >
            <svg className="icon field-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Search"
              value={search}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={open && hits.length > 0}
              aria-label="Search bangles or bracelets"
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                onSearchChange(event.target.value)
                setOpen(true)
                if (pathname !== '/shop' || params?.get('category')) {
                  router.push('/shop')
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && hits.length > 0) {
                  event.preventDefault()
                  setOpen(true)
                  setActive((index) => (index + 1) % hits.length)
                  return
                }
                if (event.key === 'ArrowUp' && hits.length > 0) {
                  event.preventDefault()
                  setActive((index) => (index - 1 + hits.length) % hits.length)
                  return
                }
                if (event.key === 'Escape') {
                  setOpen(false)
                }
              }}
            />
            {open && hits.length > 0 ? (
              <ul className="nav-search-list" role="listbox">
                {hits.map((hit, index) => (
                  <li key={`${hit.kind}-${hit.id}`}>
                    <button
                      className={index === active ? 'is-active' : undefined}
                      type="button"
                      role="option"
                      aria-selected={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => choose(hit)}
                    >
                      <span className="nav-search-kind">{hit.kind === 'collection' ? 'Collection' : 'Piece'}</span>
                      {hit.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
          <button
            className="cart-btn"
            type="button"
            onClick={onOpenCart}
            disabled={cartLocked}
            aria-label={cartLocked ? 'Cart is closed at checkout' : `Cart, ${cartCount} items`}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Zm3.2 0V6.2A3.8 3.8 0 0 1 12 2.4a3.8 3.8 0 0 1 3.8 3.8V7"
              />
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
