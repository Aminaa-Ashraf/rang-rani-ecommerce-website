import { Collections } from '../components/Collections.tsx'
import { Hero } from '../components/Hero.tsx'

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
