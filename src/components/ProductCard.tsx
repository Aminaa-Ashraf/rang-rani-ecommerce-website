import { stockLabel, stockLevel, type Product } from '../../shared/types'
import { formatPrice } from '../lib/money'

interface ProductCardProps {
  product: Product
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onSelect, onAdd }: ProductCardProps) {
  const level = stockLevel(product.stock)
  const out = level === 'out'

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
        ) : (
          <button className="btn primary card-add" type="button" onClick={() => onAdd(product)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
