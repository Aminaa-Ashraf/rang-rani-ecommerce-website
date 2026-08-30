import { useEffect, useState } from 'react'
import type { Product } from '../../shared/types'
import { ProductCard } from './ProductCard'

const PAGE_SIZE = 8

interface ProductGridProps {
  products: Product[]
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
}

export function ProductGrid({ products, onSelect, onAdd }: ProductGridProps) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [products])

  if (products.length === 0) {
    return <p className="page-status">No pieces here. Try another name or collection.</p>
  }

  const pageCount = Math.ceil(products.length / PAGE_SIZE)
  const safePage = Math.min(page, pageCount - 1)
  const visible = products.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="shop-pager">
      <section className="grid grid-four">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} onAdd={onAdd} />
        ))}
      </section>
      {pageCount > 1 ? (
        <div className="pager">
          {safePage > 0 ? (
            <button className="btn ghost" type="button" onClick={() => setPage(safePage - 1)}>
              Previous
            </button>
          ) : null}
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
          {safePage < pageCount - 1 ? (
            <button className="btn ghost" type="button" onClick={() => setPage(safePage + 1)}>
              Next
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
