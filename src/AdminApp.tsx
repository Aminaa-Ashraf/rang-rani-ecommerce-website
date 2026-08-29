import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ProductCategory, type CreateProductInput, type Product } from '../shared/types.ts'
import { ProductApi } from './api/client.ts'
import { ProductForm } from './components/ProductForm.tsx'
import { clearAdminKey, getAdminKey, setAdminKey } from './lib/adminSession.ts'
import { AdminCatalogPage } from './pages/AdminCatalogPage.tsx'
import { AdminLoginPage } from './pages/AdminLoginPage.tsx'

const api = new ProductApi()

export function AdminApp() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminKey()))
  const [loginError, setLoginError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authed) {
      return
    }

    let cancelled = false
    void api.getProducts().then((next) => {
      if (!cancelled) {
        setProducts(next)
      }
    })
    return () => {
      cancelled = true
    }
  }, [authed])

  async function handleLogin(password: string): Promise<void> {
    setLoginError(null)
    try {
      await api.login(password)
      setAdminKey(password)
      setAuthed(true)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not sign in')
    }
  }

  function signOut(): void {
    clearAdminKey()
    setAuthed(false)
    setProducts([])
  }

  async function saveProduct(input: CreateProductInput): Promise<void> {
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.updateProduct(editing.id, input)
        setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await api.createProduct(input)
        setProducts((current) => [created, ...current])
      }
      setFormOpen(false)
      setEditing(null)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not save jewelry')
    } finally {
      setSaving(false)
    }
  }

  async function changeStock(product: Product, stock: number): Promise<void> {
    try {
      const updated = await api.setStock(product.id, stock)
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not update stock')
    }
  }

  async function removeProduct(product: Product): Promise<void> {
    if (!window.confirm(`Remove "${product.title}" from the catalog?`)) {
      return
    }

    try {
      await api.deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not delete')
    }
  }

  return (
    <div className="app admin-app">
      <header className="site-header">
        <div className="header-inner admin-header">
          <Link className="brand" to="/admin">
            <img className="brand-logo" src="/logo.svg?v=lahore" alt="" />
            <span className="brand-name">Rang Rani</span>
          </Link>
          <p className="eyebrow admin-badge">Studio admin</p>
          <div className="admin-nav">
            <Link className="btn ghost" to="/shop">
              View shop
            </Link>
            {authed ? (
              <button className="btn ghost" type="button" onClick={signOut}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <Routes>
        <Route
          path="login"
          element={
            authed ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLoginPage error={loginError} onLogin={handleLogin} />
            )
          }
        />
        <Route
          index
          element={
            authed ? (
              <AdminCatalogPage
                products={products}
                onAdd={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
                onEdit={(product) => {
                  setEditing(product)
                  setFormOpen(true)
                }}
                onDelete={(product) => void removeProduct(product)}
                onStock={(product, stock) => void changeStock(product, stock)}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
      {formOpen ? (
        <ProductForm
          categories={[
            ProductCategory.Beaded,
            ProductCategory.Kundan,
            ProductCategory.Charm,
            ProductCategory.Bridal,
          ]}
          product={editing}
          saving={saving}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSubmit={saveProduct}
        />
      ) : null}
    </div>
  )
}
