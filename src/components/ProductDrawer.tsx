import { useState } from 'react'
import { stockLabel, stockLevel, type Product } from '../../shared/types.ts'
import { formatPrice } from '../lib/money.ts'

const wristSizes = ['2.2', '2.4', '2.6']

interface ProductDrawerProps {
  product: Product
  cartQty: number
  onClose: () => void
  onAddToCart: (product: Product) => void
  onQuantity: (id: string, quantity: number) => void
}

export function ProductDrawer({ product, cartQty, onClose, onAddToCart, onQuantity }: ProductDrawerProps) {
  const [size, setSize] = useState(wristSizes[1])
  const available = product.stock > 0
  const atMax = cartQty >= product.stock

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <aside
        className="panel product-detail"
        role="dialog"
        aria-labelledby="product-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="detail-top">
          <button className="btn ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div>
          <div className="gold-frame">
            <img src={product.image} alt={product.title} />
          </div>
        </div>
        <div className="detail-copy">
          <p className="category-pill">{product.category}</p>
          <h2 id="product-title">{product.title}</h2>
          <p className="price detail-price">{formatPrice(product.price)}</p>
          <p className={`stock-chip is-${stockLevel(product.stock)}`}>{stockLabel(product.stock)}</p>
          <p className="eyebrow">Wrist size</p>
          <div className="variant-row">
            {wristSizes.map((option) => (
              <button
                key={option}
                className={`variant${option === size ? ' is-selected' : ''}`}
                type="button"
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="actions">
            {!available ? (
              <button className="btn primary" type="button" disabled>
                Out of stock
              </button>
            ) : cartQty > 0 ? (
              <div className="card-qty">
                <button className="stepper-btn" type="button" onClick={() => onQuantity(product.id, cartQty - 1)}>
                  −
                </button>
                <span>{cartQty}</span>
                <button
                  className="stepper-btn"
                  type="button"
                  onClick={() => onQuantity(product.id, cartQty + 1)}
                  disabled={atMax}
                >
                  +
                </button>
              </div>
            ) : (
              <button className="btn primary" type="button" onClick={() => onAddToCart(product)}>
                Add to cart
              </button>
            )}
          </div>
          <p>{product.description}</p>
          <p className="muted">Handmade in Lahore · size {size}</p>
        </div>
      </aside>
    </div>
  )
}
