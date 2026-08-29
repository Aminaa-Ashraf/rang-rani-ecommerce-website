import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { Customer, ShopOrder } from '../../shared/types.ts'
import { formatPrice } from '../lib/money.ts'
import { loadOrders } from '../lib/shopAuth.ts'

interface AccountPageProps {
  customer: Customer | null
  onLogout: () => Promise<void>
}

function orderNumber(id: string): string {
  return id.slice(-6).toUpperCase()
}

function formatOrderDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AccountPage({ customer, onLogout }: AccountPageProps) {
  const [orders, setOrders] = useState<ShopOrder[]>([])

  useEffect(() => {
    if (!customer) {
      setOrders([])
      return
    }

    let cancelled = false
    void loadOrders(customer.id).then((next) => {
      if (!cancelled) {
        setOrders(next)
      }
    })
    return () => {
      cancelled = true
    }
  }, [customer])

  if (!customer) {
    return <Navigate to="/shop" replace />
  }

  return (
    <main className="page page-shell account-page">
      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Account</p>
            <h2 className="has-rule">
              Hello, <em>{customer.name}</em>
            </h2>
          </div>
          <button className="btn ghost" type="button" onClick={() => void onLogout()}>
            Sign out
          </button>
        </div>

        <article className="account-profile">
          <div>
            <p className="eyebrow">Email</p>
            <p>{customer.email}</p>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <p>{customer.phone}</p>
          </div>
          <div>
            <p className="eyebrow">Deliver to</p>
            <p>{customer.city ? `${customer.address}, ${customer.city}` : 'Added at checkout'}</p>
          </div>
        </article>

        <div>
          <p className="eyebrow">Orders</p>
          <h2 className="has-rule">Your jewelry</h2>
        </div>

        {orders.length === 0 ? (
          <p className="lede">No orders yet.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <header className="order-card-head">
                  <div>
                    <p className="eyebrow">Order {orderNumber(order.id)}</p>
                    <p className="order-date">{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <p className="order-status">Confirmed</p>
                </header>

                <ul className="order-lines">
                  {(order.items ?? []).map((item) => (
                    <li key={`${order.id}-${item.productId}`}>
                      <img src={item.image || '/logo.svg'} alt="" />
                      <div>
                        <strong>{item.title}</strong>
                        <p>
                          Qty {item.quantity} · {formatPrice(item.price)} each
                        </p>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <footer className="order-card-foot">
                  <p>
                    Ship to {order.address}, {order.city}
                  </p>
                  <p className="order-total">
                    Total <strong>{formatPrice(order.total)}</strong>
                  </p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
