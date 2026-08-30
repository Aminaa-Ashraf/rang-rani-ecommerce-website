import { stockLabel, stockLevel, type Product } from '../../shared/types.ts'
import { formatPrice } from '../lib/money.ts'

interface ProductCardProps {
  product: Product
  cartQty: number
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
  onQuantity: (id: string, quantity: number) => void
}

export function ProductCard({ product, cartQty, onSelect, onAdd, onQuantity }: ProductCardProps) {
  const level = stockLevel(product.stock)
  const out = level === 'out'
  const atMax = cartQty >= product.stock

  return (
    <article className={`card shop-card${out ? ' is-out' : ''}`}>
      <div className="card-media">
        <button className="card-photo" type="button" onClick={() => onSelect(product.id)}>
          <img src={product.image} alt={product.title} />
        </button>
        {level !== 'in' ? (
          <span className={`stock-badge is-${level}`}>{stockLabel(product.stock)}</span>
        ) : null}
      </div>
      <div className="card-body">
        <p className="category-pill">{product.category}</p>
        <h3 className="card-title">
          <button type="button" onClick={() => onSelect(product.id)}>
            {product.title}
          </button>
        </h3>
        <p className="price">{formatPrice(product.price)}</p>
        {out ? (
          <p className="muted card-stock-note">Out of stock</p>
        ) : cartQty > 0 ? (
          <div className="card-qty">
            <button
              className="stepper-btn"
              type="button"
              onClick={() => onQuantity(product.id, cartQty - 1)}
              aria-label={`Remove one ${product.title}`}
            >
              −
            </button>
            <span>{cartQty}</span>
            <button
              className="stepper-btn"
              type="button"
              onClick={() => onQuantity(product.id, cartQty + 1)}
              disabled={atMax}
              aria-label={`Add one ${product.title}`}
            >
              +
            </button>
          </div>
        ) : (
          <button className="btn primary card-add" type="button" onClick={() => onAdd(product)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
