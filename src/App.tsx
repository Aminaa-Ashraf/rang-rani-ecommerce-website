'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { ApiStatus, CartItem, Customer, Product, ProductCategory } from '../shared/types'
import { ProductApi } from './api/client'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ProductDrawer } from './components/ProductDrawer'
import { loadCart, saveCart } from './lib/cartStorage'
import { productMatchesSearch } from './lib/shopLabels'
import { auth } from './lib/firebase'
import {
  checkoutNewCustomer,
  loadCustomer,
  placeSignedInOrder,
  signOutShop,
  watchAuth,
  type CheckoutDetails,
} from './lib/shopAuth'
import { ScrollToTop } from './views/ScrollToTop'

const api = new ProductApi()

interface ShopContextValue {
  visible: Product[]
  categories: ProductCategory[]
  search: string
  category: ProductCategory | 'all'
  setSearch: (value: string) => void
  setCategory: (value: ProductCategory | 'all') => void
  openProduct: (id: string) => Promise<void>
  addToCart: (product: Product) => void
  setCartQuantity: (id: string, quantity: number) => void
  cartQty: Record<string, number>
  cart: CartItem[]
  customer: Customer | null
  authError: string | null
  orderError: string | null
  authSaving: boolean
  closeCart: () => void
  checkout: (details: CheckoutDetails) => Promise<void>
  signOutShop: () => Promise<void>
}

const ShopContext = createContext<ShopContextValue | null>(null)

export function useShop(): ShopContextValue {
  const value = useContext(ShopContext)
  if (!value) {
    throw new Error('useShop must be used inside ShopShell')
  }
  return value
}

interface ShopShellProps {
  children: ReactNode
}

export function ShopShell({ children }: ShopShellProps) {
  const pathname = usePathname() ?? ''
  const cartLocked = pathname === '/checkout' || pathname === '/thanks'
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [selected, setSelected] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>(() => loadCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSaving, setAuthSaving] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  useEffect(() => {
    if (cartLocked) {
      setCartOpen(false)
    }
  }, [cartLocked])

  useEffect(() => {
    return watchAuth((user) => {
      if (!user) {
        setCustomer(null)
        return
      }
      void loadCustomer(user.uid).then((record) => {
        setCustomer(
          record ?? {
            id: user.uid,
            name: user.displayName ?? '',
            email: user.email ?? '',
            phone: '',
            city: '',
            address: '',
          },
        )
      })
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load(): Promise<void> {
      try {
        const [nextProducts, nextCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ])
        if (cancelled) {
          return
        }
        setProducts(nextProducts)
        setCategories(nextCategories)
        setStatus('success')
      } catch (loadError) {
        if (cancelled) {
          return
        }
        setStatus('error')
        setError(loadError instanceof Error ? loadError.message : 'API request failed')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const visible = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = productMatchesSearch(product, search)
      const matchesCategory =
        search.trim().length > 0 || category === 'all' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  async function openProduct(id: string): Promise<void> {
    try {
      setSelected(await api.getProduct(id))
    } catch (loadError) {
      window.alert(loadError instanceof Error ? loadError.message : 'Could not load jewelry')
    }
  }

  useEffect(() => {
    if (products.length === 0) {
      return
    }

    setCart((current) => {
      let changed = false
      const next = current.flatMap((item) => {
        const live = products.find((product) => product.id === item.id)
        const stock = live?.stock ?? item.stock
        const quantity = Math.min(item.quantity, stock)
        if (quantity <= 0) {
          changed = true
          return []
        }
        if (quantity !== item.quantity || stock !== item.stock || (live && live.price !== item.price)) {
          changed = true
          return [{ ...(live ?? item), quantity }]
        }
        return [item]
      })
      return changed ? next : current
    })
  }, [products])

  const cartQty = useMemo(
    () => Object.fromEntries(cart.map((item) => [item.id, item.quantity])),
    [cart],
  )

  function addToCart(product: Product): void {
    const inCart = cart.find((item) => item.id === product.id)?.quantity ?? 0
    if (product.stock <= 0) {
      setToast('This piece is out of stock')
      return
    }
    if (inCart >= product.stock) {
      setToast(`Only ${product.stock} left`)
      return
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, ...product, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  function setCartQuantity(id: string, quantity: number): void {
    const product = products.find((item) => item.id === id)
    const max = product?.stock ?? 0
    if (quantity > max) {
      setToast(max <= 0 ? 'This piece is out of stock' : `Only ${max} left`)
      quantity = max
    }

    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  function cartLines(items: CartItem[]): { productId: string; quantity: number }[] {
    return items.map((item) => ({ productId: item.id, quantity: item.quantity }))
  }

  async function withReservedStock(write: () => Promise<void>): Promise<void> {
    const items = cartLines(cart)
    await api.commitStock(items)
    try {
      await write()
      setCart([])
      setProducts(await api.getProducts())
    } catch (writeError) {
      await api.releaseStock(items)
      throw writeError
    }
  }

  async function handleCheckoutNew(details: CheckoutDetails): Promise<void> {
    setAuthError(null)
    setOrderError(null)
    setAuthSaving(true)
    try {
      await withReservedStock(() => checkoutNewCustomer(details, cart))
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : 'Could not save the order'
      setAuthError(message)
      throw checkoutError
    } finally {
      setAuthSaving(false)
    }
  }

  async function handlePlaceOrder(city: string, address: string): Promise<void> {
    const user = auth.currentUser
    if (!user || !customer) {
      setOrderError('Add your contact at checkout first')
      throw new Error('Not signed in')
    }

    setOrderError(null)
    try {
      await withReservedStock(() => placeSignedInOrder(user, customer, city, address, cart))
      setCustomer({ ...customer, city, address })
    } catch (placeError) {
      setOrderError(placeError instanceof Error ? placeError.message : 'Could not place order')
      throw placeError
    }
  }

  async function checkout(details: CheckoutDetails): Promise<void> {
    if (customer && auth.currentUser) {
      await handlePlaceOrder(details.city, details.address)
    } else {
      await handleCheckoutNew(details)
    }
    await signOutShop()
  }

  const shop: ShopContextValue = {
    visible,
    categories,
    search,
    category,
    setSearch,
    setCategory,
    openProduct,
    addToCart,
    setCartQuantity,
    cartQty,
    cart,
    customer,
    authError,
    orderError,
    authSaving,
    closeCart: () => setCartOpen(false),
    checkout,
    signOutShop,
  }

  if (status === 'loading') {
    return <p className="page-status">Rang Rani is opening the jewelry box...</p>
  }

  if (status === 'error') {
    return (
      <main className="page-status">
        <p className="error">{error}</p>
        <p>The catalog could not load. If this is the live shop, allow Atlas Network Access from 0.0.0.0/0, then refresh.</p>
      </main>
    )
  }

  return (
    <ShopContext.Provider value={shop}>
      <div className="app">
        <ScrollToTop />
        <Navbar
          search={search}
          products={products}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onSearchChange={(value) => {
            setSearch(value)
            if (value.trim()) {
              setCategory('all')
            }
          }}
          onPickCollection={(next) => {
            setSearch('')
            setCategory(next)
          }}
          onPickProduct={(id) => {
            void openProduct(id)
          }}
          cartLocked={cartLocked}
          onOpenCart={() => {
            if (!cartLocked) {
              setCartOpen(true)
            }
          }}
        />
        {children}
        <Footer />
        {selected ? (
          <ProductDrawer
            product={selected}
            onClose={() => setSelected(null)}
            onAddToCart={addToCart}
          />
        ) : null}
        {cartOpen && !cartLocked ? (
          <CartDrawer items={cart} onClose={() => setCartOpen(false)} onQuantity={setCartQuantity} />
        ) : null}
        {toast ? (
          <div className="cart-toast" role="status">
            <div>
              <p className="eyebrow">{toast.includes('×') ? 'Added' : 'Cart'}</p>
              <p>{toast}</p>
            </div>
            <div className="cart-toast-actions">
              <button className="btn ghost" type="button" onClick={() => setToast(null)}>
                Keep shopping
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  setToast(null)
                  setCartOpen(true)
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </ShopContext.Provider>
  )
}
