import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isProductCategory } from '../../shared/types.ts'
import { ProductGrid } from '../components/ProductGrid.tsx'
import { Toolbar } from '../components/Toolbar.tsx'
import type { Product, ProductCategory } from '../../shared/types.ts'

interface ShopPageProps {
  products: Product[]
  categories: ProductCategory[]
  search: string
  category: ProductCategory | 'all'
  onSearchChange: (value: string) => void
  onCategoryChange: (value: ProductCategory | 'all') => void
  onSelect: (id: string) => void
  onAdd: (product: Product) => void
  onQuantity: (id: string, quantity: number) => void
  cartQty: Record<string, number>
}

export function ShopPage({
  products,
  categories,
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onSelect,
  onAdd,
  onQuantity,
  cartQty,
}: ShopPageProps) {
  const [params] = useSearchParams()

  useEffect(() => {
    const next = params.get('category')
    onCategoryChange(isProductCategory(next) ? next : 'all')
  }, [params, onCategoryChange])

  return (
    <main className="page page-shell">
      <section className="section" id="shop">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop</p>
            <h2 className="has-rule">
              The jewelry <em>wall</em>
            </h2>
          </div>
        </div>
        <Toolbar search={search} onSearchChange={onSearchChange} />
        <div className="shop-cats" role="tablist" aria-label="Shop categories">
          <button
            className={`shop-cat${category === 'all' ? ' is-active' : ''}`}
            type="button"
            onClick={() => onCategoryChange('all')}
          >
            All jewelry
          </button>
          {categories.map((item) => (
            <button
              key={item}
              className={`shop-cat${category === item ? ' is-active' : ''}`}
              type="button"
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <ProductGrid
          products={products}
          cartQty={cartQty}
          onSelect={onSelect}
          onAdd={onAdd}
          onQuantity={onQuantity}
        />
      </section>
    </main>
  )
}
