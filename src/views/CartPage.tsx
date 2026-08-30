'use client'

import { useShop } from '../App'
import { formatPrice } from '../lib/money'
import { Link } from '../lib/nav'

export function CartPage() {
  const shop = useShop()
  const subtotal = shop.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (shop.cart.length === 0) {
    return (
      <main className="page page-shell">
        <section className="section">
          <p className="eyebrow">Cart</p>
          <h2 className="has-rule">
            Your <em>cart</em>
          </h2>
          <p className="lede">Your cart is empty.</p>
          <Link className="btn primary" to="/shop">
            Continue shopping
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Cart</p>
        <h2 className="has-rule">
          Your <em>cart</em>
        </h2>
        <div className="cart-page-layout">
          <div className="checkout-box">
            {shop.cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <img src={item.image} alt="" />
                <div className="cart-copy">
                  <h3>{item.title}</h3>
                  <p className="category-pill">{item.category}</p>
                  <div className="stepper">
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => shop.setCartQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => shop.setCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-row-side">
                  <p className="price">{formatPrice(item.price * item.quantity)}</p>
                  <button className="cart-remove" type="button" onClick={() => shop.setCartQuantity(item.id, 0)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="checkout-box checkout-summary">
            <p className="eyebrow">Summary</p>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong className="summary-total">{formatPrice(subtotal)}</strong>
            </div>
            <p className="muted cart-note">Shipping is set at checkout.</p>
            <Link className="btn primary cart-checkout" to="/checkout">
              Proceed to checkout
            </Link>
            <Link className="btn ghost cart-checkout" to="/shop">
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}
