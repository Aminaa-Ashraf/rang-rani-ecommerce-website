'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { isProductCategory, type Product, type ProductCategory } from '../../shared/types'
import { ProductGrid } from '../components/ProductGrid'
import { shopCategoryLabel } from '../lib/shopLabels'

interface ShopPageProps {
  products: Product[]
  categories: ProductCategory[]
  search: string
  category: ProductCategory | 'all'
  onCategoryChange: (value: ProductCategory | 'all') => void
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
}

export function ShopPage({
  products,
  categories,
  search,
  category,
  onCategoryChange,
  onSelect,
  onAdd,
}: ShopPageProps) {
  const params = useSearchParams()

  useEffect(() => {
    if (search.trim()) {
      return
    }
    const next = params?.get('category')
    onCategoryChange(isProductCategory(next) ? next : 'all')
  }, [params, onCategoryChange, search])

  return (
    <main className="page page-shell">
      <section className="section" id="shop">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop</p>
            <h2 className="has-rule">
              What is on the <em>wall</em>
            </h2>
          </div>
        </div>
        <div className="shop-cats" role="tablist" aria-label="Shop categories">
          <button
            className={`shop-cat${category === 'all' ? ' is-active' : ''}`}
            type="button"
            onClick={() => onCategoryChange('all')}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              className={`shop-cat${category === item ? ' is-active' : ''}`}
              type="button"
              onClick={() => onCategoryChange(item)}
            >
              {shopCategoryLabel[item] ?? item}
            </button>
          ))}
        </div>
        <ProductGrid products={products} onSelect={onSelect} onAdd={onAdd} />
      </section>
    </main>
  )
}
