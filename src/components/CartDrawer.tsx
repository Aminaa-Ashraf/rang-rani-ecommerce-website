'use client'

import { useRouter } from 'next/navigation'
import type { CartItem } from '../../shared/types'
import { formatPrice } from '../lib/money'

interface CartDrawerProps {
  items: CartItem[]
  onClose: () => void
  onQuantity: (id: string, quantity: number) => void
}

export function CartDrawer({ items, onClose, onQuantity }: CartDrawerProps) {
  const router = useRouter()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="overlay overlay-drawer" onClick={onClose} role="presentation">
      <aside
        className="panel cart-panel"
        role="dialog"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cart-head">
          <div>
            <p className="eyebrow">Cart</p>
            <h2 id="cart-title">Your cart</h2>
          </div>
          <button className="cart-close" type="button" onClick={onClose} aria-label="Close cart">
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-state">
            <span className="cart-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Zm3.2 0V6.2A3.8 3.8 0 0 1 12 2.4a3.8 3.8 0 0 1 3.8 3.8V7"
                />
              </svg>
            </span>
            <h3>Your cart is empty</h3>
            <p className="lede">Add bangles or bracelets from the wall.</p>
            <button className="btn primary" type="button" onClick={onClose}>
              Keep shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-row" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-copy">
                    <h3>{item.title}</h3>
                    <p className="category-pill">{item.category}</p>
                    <div className="stepper">
                      <button className="stepper-btn" type="button" onClick={() => onQuantity(item.id, item.quantity - 1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => onQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-row-side">
                    <p className="price">{formatPrice(item.price * item.quantity)}</p>
                    <button className="cart-remove" type="button" onClick={() => onQuantity(item.id, 0)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-foot">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong className="summary-total">{formatPrice(subtotal)}</strong>
              </div>
              <p className="muted cart-note">Shipping is set at checkout.</p>
              <button
                className="btn primary cart-checkout"
                type="button"
                onClick={() => {
                  onClose()
                  router.push('/checkout')
                }}
              >
                Proceed to checkout
              </button>
              <button
                className="btn ghost cart-checkout"
                type="button"
                onClick={() => {
                  onClose()
                  router.push('/cart')
                }}
              >
                View cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
