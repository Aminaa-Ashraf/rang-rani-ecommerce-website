import { useEffect, useState } from 'react'
import type { Product } from '../../shared/types.ts'
import { ProductCard } from './ProductCard.tsx'

const PAGE_SIZE = 4

interface ProductGridProps {
  products: Product[]
  cartQty?: Record<string, number>
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
  onQuantity: (id: string, quantity: number) => void
}

export function ProductGrid({
  products,
  cartQty = {},
  onSelect,
  onAdd,
  onQuantity,
}: ProductGridProps) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [products])

  if (products.length === 0) {
    return <p className="page-status">No jewelry in this filter. Try another collection.</p>
  }

  const pageCount = Math.ceil(products.length / PAGE_SIZE)
  const safePage = Math.min(page, pageCount - 1)
  const visible = products.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="shop-pager">
      <section className="grid grid-four">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartQty={cartQty?.[product.id] ?? 0}
            onSelect={onSelect}
            onAdd={onAdd}
            onQuantity={onQuantity}
          />
        ))}
      </section>
      {pageCount > 1 ? (
        <div className="pager">
          <button className="btn ghost" type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
            Previous
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              className={`pager-page${index === safePage ? ' is-active' : ''}`}
              type="button"
              onClick={() => setPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn ghost"
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}
