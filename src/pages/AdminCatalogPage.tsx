import { useMemo, useState } from 'react'
import { stockLabel, stockLevel, type Product, type StockLevel } from '../../shared/types.ts'
import { formatPrice } from '../lib/money.ts'

interface AdminCatalogPageProps {
  products: Product[]
  onAdd: () => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onStock: (product: Product, stock: number) => void
}

type StockFilter = 'all' | StockLevel

export function AdminCatalogPage({ products, onAdd, onEdit, onDelete, onStock }: AdminCatalogPageProps) {
  const [filter, setFilter] = useState<StockFilter>('all')

  const stats = useMemo(() => {
    const units = products.reduce((sum, product) => sum + product.stock, 0)
    const inStock = products.filter((product) => stockLevel(product.stock) === 'in').length
    const low = products.filter((product) => stockLevel(product.stock) === 'low').length
    const out = products.filter((product) => stockLevel(product.stock) === 'out').length
    return { units, inStock, low, out }
  }, [products])

  const visible = products.filter((product) => filter === 'all' || stockLevel(product.stock) === filter)

  return (
    <main className="page page-shell">
      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Admin</p>
            <h2 className="has-rule">
              Studio <em>catalog</em>
            </h2>
          </div>
          <button className="btn primary" type="button" onClick={onAdd}>
            Add jewelry
          </button>
        </div>
        <p className="lede">Set how many pieces are in stock. The shop shows in stock or out of stock from this list.</p>
        <div className="stock-stats">
          <article className="stock-stat">
            <p className="eyebrow">On the wall</p>
            <strong>{products.length}</strong>
            <p className="muted">jewelry styles</p>
          </article>
          <article className="stock-stat">
            <p className="eyebrow">Pieces in stock</p>
            <strong>{stats.units}</strong>
            <p className="muted">ready to sell</p>
          </article>
          <article className="stock-stat is-low">
            <p className="eyebrow">Low stock</p>
            <strong>{stats.low}</strong>
            <p className="muted">3 or fewer left</p>
          </article>
          <article className="stock-stat is-out">
            <p className="eyebrow">Out of stock</p>
            <strong>{stats.out}</strong>
            <p className="muted">hidden from cart</p>
          </article>
        </div>
        <div className="stock-filters">
          {(
            [
              ['all', `All (${products.length})`],
              ['in', `In stock (${stats.inStock})`],
              ['low', `Low (${stats.low})`],
              ['out', `Out (${stats.out})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              className={`stock-filter${filter === value ? ' is-active' : ''}`}
              type="button"
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const level = stockLevel(product.stock)
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-piece">
                        <img src={product.image} alt="" />
                        <strong>{product.title}</strong>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <div className="stock-stepper">
                        <button
                          className="stepper-btn"
                          type="button"
                          onClick={() => onStock(product, Math.max(0, product.stock - 1))}
                          disabled={product.stock <= 0}
                          aria-label={`Remove one from ${product.title}`}
                        >
                          −
                        </button>
                        <span>{product.stock}</span>
                        <button
                          className="stepper-btn"
                          type="button"
                          onClick={() => onStock(product, product.stock + 1)}
                          aria-label={`Add one to ${product.title}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-chip is-${level}`}>{stockLabel(product.stock)}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn ghost" type="button" onClick={() => onEdit(product)}>
                          Edit
                        </button>
                        <button className="btn danger" type="button" onClick={() => onDelete(product)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
