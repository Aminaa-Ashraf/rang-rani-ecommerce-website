'use client'

import dynamic from 'next/dynamic'

const AdminApp = dynamic(() => import('../../../AdminApp').then((mod) => mod.AdminApp), {
  ssr: false,
})

export default function AdminPage() {
  return <AdminApp />
}
