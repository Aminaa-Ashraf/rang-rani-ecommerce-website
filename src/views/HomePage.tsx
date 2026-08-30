import { Collections } from '../components/Collections'
import { Hero } from '../components/Hero'

export function HomePage() {
  return (
    <>
      <Hero />
      <main className="page page-shell">
        <Collections />
      </main>
    </>
  )
}
