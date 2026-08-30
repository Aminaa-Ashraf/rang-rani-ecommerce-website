import { useState } from 'react'
import { stockLabel, stockLevel, type Product } from '../../shared/types'
import { formatPrice } from '../lib/money'

const wristSizes = ['2.2', '2.4', '2.6']

interface ProductDrawerProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductDrawer({ product, onClose, onAddToCart }: ProductDrawerProps) {
  const [size, setSize] = useState(wristSizes[1])
  const available = product.stock > 0

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
            <button className="btn primary" type="button" disabled={!available} onClick={() => onAddToCart(product)}>
              {available ? 'Add to cart' : 'Out of stock'}
            </button>
          </div>
          <p>{product.description}</p>
          <p className="muted">From Lahore · size {size}</p>
        </div>
      </aside>
    </div>
  )
}
