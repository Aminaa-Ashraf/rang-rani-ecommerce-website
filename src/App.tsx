import { useEffect, useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { ApiStatus, CartItem, Customer, Product, ProductCategory } from '../shared/types.ts'
import { ProductApi } from './api/client.ts'
import { CartDrawer } from './components/CartDrawer.tsx'
import { Footer } from './components/Footer.tsx'
import { Navbar } from './components/Navbar.tsx'
import { ProductDrawer } from './components/ProductDrawer.tsx'
import { loadCart, saveCart } from './lib/cartStorage.ts'
import { auth } from './lib/firebase.ts'
import {
  checkoutNewCustomer,
  loadCustomer,
  placeSignedInOrder,
  signOutShop,
  watchAuth,
  type CheckoutDetails,
} from './lib/shopAuth.ts'
import { AboutPage } from './pages/AboutPage.tsx'
import { AccountPage } from './pages/AccountPage.tsx'
import { CollectionsPage } from './pages/CollectionsPage.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { FaqPage } from './pages/FaqPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { ShopPage } from './pages/ShopPage.tsx'
import { ScrollToTop } from './pages/ScrollToTop.tsx'

const api = new ProductApi()

export function App() {
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
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = query.length === 0 || product.title.toLowerCase().includes(query)
      const matchesCategory = category === 'all' || product.category === category
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
    setToast(`${product.title} × ${inCart + 1}`)
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
      setOrderError('Add your contact in the cart first')
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

  if (status === 'loading') {
    return <p className="page-status">Rang Rani is opening the jewelry box...</p>
  }

  if (status === 'error') {
    return (
      <main className="page-status">
        <p className="error">{error}</p>
        <p>Run `npm run dev` so the API and shop start together.</p>
      </main>
    )
  }

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar
        customer={customer}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/shop"
          element={
            <ShopPage
              products={visible}
              categories={categories}
              search={search}
              category={category}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onSelect={openProduct}
              onAdd={addToCart}
              onQuantity={setCartQuantity}
              cartQty={cartQty}
            />
          }
        />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<AccountPage customer={customer} onLogout={signOutShop} />} />
      </Routes>
      <Footer />
      {selected ? (
        <ProductDrawer
          product={selected}
          cartQty={cartQty?.[selected.id] ?? 0}
          onClose={() => setSelected(null)}
          onAddToCart={addToCart}
          onQuantity={setCartQuantity}
        />
      ) : null}
      {cartOpen ? (
        <CartDrawer
          items={cart}
          customer={customer}
          authError={authError}
          authSaving={authSaving}
          orderError={orderError}
          onClose={() => setCartOpen(false)}
          onQuantity={setCartQuantity}
          onCheckoutNew={handleCheckoutNew}
          onPlaceOrder={handlePlaceOrder}
        />
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
  )
}
