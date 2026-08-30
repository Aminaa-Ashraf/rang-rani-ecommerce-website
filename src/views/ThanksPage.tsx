'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '../lib/money'
import { Link } from '../lib/nav'
import { clearReceipt, loadReceipt, type OrderReceipt } from '../lib/orderReceipt'

export function ThanksPage() {
  const router = useRouter()
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const next = loadReceipt()
    setReceipt(next)
    setReady(true)
    if (!next) {
      router.replace('/shop')
    }
  }, [router])

  if (!ready || !receipt) {
    return <p className="page-status">Opening your order...</p>
  }

  const firstName = receipt.name.trim().split(/\s+/)[0]

  return (
    <main className="page page-shell">
      <section className="thanks-layout">
        <div className="thanks-copy">
          <p className="eyebrow">Confirmed</p>
          <h1>{firstName ? `Thank you, ${firstName}!` : 'Thank you for shopping'}</h1>
          <h2>Your order is confirmed</h2>
          <p className="lede">
            We have your order. We will pack it in Lahore and share courier details before it leaves.
          </p>
          <div className="thanks-block">
            <p className="eyebrow">Delivery</p>
            <p>
              <strong>{receipt.name}</strong>
            </p>
            {receipt.address ? <p>{receipt.address}</p> : null}
            {receipt.city ? <p>{receipt.city}</p> : null}
          </div>
          <Link className="btn primary" to="/shop" onClick={clearReceipt}>
            Continue shopping
          </Link>
        </div>
        <aside className="thanks-summary">
          <p className="eyebrow">Order summary</p>
          <ul className="checkout-lines">
            {receipt.items.map((item) => (
              <li key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.title}</strong>
                  <p>Qty {item.quantity}</p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(receipt.total)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Cash on delivery</span>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong className="summary-total">{formatPrice(receipt.total)}</strong>
          </div>
        </aside>
      </section>
    </main>
  )
}
