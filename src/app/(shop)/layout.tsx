'use client'

import dynamic from 'next/dynamic'
import { Suspense, type ReactNode } from 'react'

const ShopShell = dynamic(() => import('../../App').then((mod) => mod.ShopShell), {
  ssr: false,
  loading: () => <p className="page-status">Rang Rani is opening the jewelry box...</p>,
})

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="page-status">Rang Rani is opening the jewelry box...</p>}>
      <ShopShell>{children}</ShopShell>
    </Suspense>
  )
}
