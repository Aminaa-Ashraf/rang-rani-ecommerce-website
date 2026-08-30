'use client'

import { Suspense } from 'react'
import { useShop } from '../../../App'
import { ShopPage } from '../../../views/ShopPage'

function ShopRoute() {
  const shop = useShop()

  return (
    <ShopPage
      products={shop.visible}
      categories={shop.categories}
      search={shop.search}
      category={shop.category}
      onCategoryChange={shop.setCategory}
      onSelect={shop.openProduct}
      onAdd={shop.addToCart}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShopRoute />
    </Suspense>
  )
}
