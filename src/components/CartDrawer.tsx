import { useEffect, useState, type FormEvent } from 'react'
import type { CartItem, Customer } from '../../shared/types.ts'
import type { CheckoutDetails } from '../lib/shopAuth.ts'
import { formatPrice } from '../lib/money.ts'

interface CartDrawerProps {
  items: CartItem[]
  customer: Customer | null
  authError: string | null
  authSaving: boolean
  orderError: string | null
  onClose: () => void
  onQuantity: (id: string, quantity: number) => void
  onCheckoutNew: (details: CheckoutDetails) => Promise<void>
  onPlaceOrder: (city: string, address: string) => Promise<void>
}

export function CartDrawer({
  items,
  customer,
  authError,
  authSaving,
  orderError,
  onClose,
  onQuantity,
  onCheckoutNew,
  onPlaceOrder,
}: CartDrawerProps) {
  const [placed, setPlaced] = useState(false)
  const [step, setStep] = useState<'bag' | 'checkout'>('bag')
  const [name, setName] = useState(customer?.name ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [city, setCity] = useState(customer?.city ?? '')
  const [address, setAddress] = useState(customer?.address ?? '')
  const [saving, setSaving] = useState(false)
  const [sentTo, setSentTo] = useState('')

  useEffect(() => {
    setName(customer?.name ?? '')
    setEmail(customer?.email ?? '')
    setPhone(customer?.phone ?? '')
    setCity(customer?.city ?? '')
    setAddress(customer?.address ?? '')
  }, [customer])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSaving(true)
    try {
      if (customer) {
        await onPlaceOrder(city, address)
        setSentTo(customer.email)
      } else {
        await onCheckoutNew({ name, email, phone, city, address })
        setSentTo(email.trim())
      }
      setPlaced(true)
    } catch {
      // parent shows the error
    } finally {
      setSaving(false)
    }
  }

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
            <p className="eyebrow">{step === 'checkout' ? 'Checkout' : 'Cart'}</p>
            <h2 id="cart-title">{placed ? 'Order received' : step === 'checkout' ? 'Your details' : 'Your bag'}</h2>
          </div>
          <button className="cart-close" type="button" onClick={onClose} aria-label="Close cart">
            Close
          </button>
        </header>

        {placed ? (
          <div className="cart-state">
            <span className="cart-mark" aria-hidden="true" />
            <h3>Thank you</h3>
            <p className="lede">
              Your order is placed. A confirmation is going to <strong>{sentTo || 'your email'}</strong>.
            </p>
            <button className="btn primary" type="button" onClick={onClose}>
              Keep shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-state">
            <span className="cart-mark" aria-hidden="true" />
            <h3>Your bag is empty</h3>
            <p className="lede">Add jewelry, then press Done when you are ready.</p>
            <button className="btn primary" type="button" onClick={onClose}>
              Keep shopping
            </button>
          </div>
        ) : step === 'bag' ? (
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
              <button className="btn ghost" type="button" onClick={onClose}>
                Keep shopping
              </button>
              <button className="btn primary cart-checkout" type="button" onClick={() => setStep('checkout')}>
                Done
              </button>
            </div>
          </>
        ) : (
          <form className="form cart-checkout-form" onSubmit={(event) => void handleSubmit(event)}>
            <ul className="cart-summary-list">
              {items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            {customer ? (
              <p className="cart-note">
                Sending to <strong>{customer.name}</strong> · {customer.email}
              </p>
            ) : (
              <>
                <label>
                  Name
                  <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
                </label>
                <label>
                  Email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
                </label>
                <label>
                  Phone
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" />
                </label>
              </>
            )}
            <div className="cart-fields">
              <label>
                City
                <input value={city} onChange={(event) => setCity(event.target.value)} required />
              </label>
              <label>
                Address
                <input value={address} onChange={(event) => setAddress(event.target.value)} required />
              </label>
            </div>
            {authError || orderError ? <p className="error">{authError ?? orderError}</p> : null}
            <button className="btn ghost" type="button" onClick={() => setStep('bag')}>
              Back to bag
            </button>
            <button className="btn primary cart-checkout" type="submit" disabled={saving || authSaving}>
              {saving || authSaving ? 'Saving...' : 'Place order'}
            </button>
          </form>
        )}
      </aside>
    </div>
  )
}
