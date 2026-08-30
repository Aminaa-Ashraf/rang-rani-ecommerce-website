'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useShop } from '../App'
import { formatPrice } from '../lib/money'
import { Link } from '../lib/nav'
import { saveReceipt } from '../lib/orderReceipt'

export function CheckoutPage() {
  const router = useRouter()
  const shop = useShop()
  const [name, setName] = useState(shop.customer?.name ?? '')
  const [email, setEmail] = useState(shop.customer?.email ?? '')
  const [phone, setPhone] = useState(shop.customer?.phone ?? '')
  const [city, setCity] = useState(shop.customer?.city ?? '')
  const [address, setAddress] = useState(shop.customer?.address ?? '')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setName(shop.customer?.name ?? '')
    setEmail(shop.customer?.email ?? '')
    setPhone(shop.customer?.phone ?? '')
    setCity(shop.customer?.city ?? '')
    setAddress(shop.customer?.address ?? '')
  }, [shop.customer])

  useEffect(() => {
    if (!saving && !done && shop.cart.length === 0) {
      router.replace('/shop')
    }
  }, [saving, done, router, shop.cart.length])

  const subtotal = shop.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSaving(true)
    try {
      const items = shop.cart.map((item) => ({ ...item }))
      await shop.checkout({ name, email, phone, city, address })
      saveReceipt({
        name,
        city,
        address,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      })
      setDone(true)
      router.replace('/thanks')
    } catch {
      // shop context shows the error
    } finally {
      setSaving(false)
    }
  }

  if (saving || done) {
    return <p className="page-status">Placing your order...</p>
  }

  if (shop.cart.length === 0) {
    return <p className="page-status">Opening checkout...</p>
  }

  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Checkout</p>
        <h2 className="has-rule">
          Your <em>details</em>
        </h2>
        <p className="lede">Fill this in. We confirm on email, then send courier details.</p>
        <div className="checkout-layout">
          <form className="form checkout-box" onSubmit={(event) => void handleSubmit(event)}>
            <p className="eyebrow">Contact</p>
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Phone
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" />
            </label>
            <p className="eyebrow">Delivery</p>
            <label>
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} required autoComplete="address-level2" />
            </label>
            <label>
              Address
              <input value={address} onChange={(event) => setAddress(event.target.value)} required autoComplete="street-address" />
            </label>
            {shop.authError || shop.orderError ? <p className="error">{shop.authError ?? shop.orderError}</p> : null}
            <div className="checkout-actions">
              <Link className="btn ghost" to="/shop">
                Back to shop
              </Link>
              <button className="btn primary" type="submit" disabled={saving || shop.authSaving}>
                {saving || shop.authSaving ? 'Saving...' : 'Place order'}
              </button>
            </div>
          </form>
          <aside className="checkout-box checkout-summary">
            <p className="eyebrow">Order</p>
            <h3>On the way</h3>
            <ul className="checkout-lines">
              {shop.cart.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      Qty {item.quantity} · {formatPrice(item.price)}
                    </p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>Total</span>
              <strong className="summary-total">{formatPrice(subtotal)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
