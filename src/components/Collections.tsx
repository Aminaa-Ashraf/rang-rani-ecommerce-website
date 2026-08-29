import { Link } from 'react-router-dom'
import { ProductCategory } from '../../shared/types.ts'

const stories = [
  { category: ProductCategory.Beaded, title: 'Beaded', copy: 'Moti stacks and everyday beads.', motif: 'beads' },
  { category: ProductCategory.Kundan, title: 'Kundan', copy: 'Shaadi-ready shine.', motif: 'gem' },
  { category: ProductCategory.Charm, title: 'Charm', copy: 'Smileys, chains, and charm wraps.', motif: 'star' },
  { category: ProductCategory.Bridal, title: 'Bridal', copy: 'Bangles and sets for shaadi.', motif: 'paisley' },
] as const

function Motif({ name }: { name: (typeof stories)[number]['motif'] }) {
  if (name === 'beads') {
    return (
      <svg className="collection-motif" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="7" cy="14" r="3.2" fill="currentColor" />
        <circle cx="14" cy="14" r="3.2" fill="currentColor" />
        <circle cx="21" cy="14" r="3.2" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'gem') {
    return (
      <svg className="collection-motif" viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 4 24 14 14 24 4 14Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg className="collection-motif" viewBox="0 0 28 28" aria-hidden="true">
        <path
          d="M14 4.5 16.4 11h6.6l-5.3 4 2 6.5L14 17.8 8.3 21.5l2-6.5-5.3-4h6.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    )
  }

  return (
    <svg className="collection-motif" viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M16 5c4 2 7 7 5 12-2 5-8 7-12 4 5 0 8-3 8-7 0-3-2-5-5-6 2-2 3-3 4-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function Collections() {
  return (
    <section className="section" id="collections">
      <div>
        <p className="eyebrow">Collections</p>
        <h2 className="has-rule">
          Four families, <em>one wall</em>
        </h2>
      </div>
      <div className="collection-grid">
        {stories.map((story) => (
          <Link key={story.category} className="collection-card" to={`/shop?category=${story.category}`}>
            <Motif name={story.motif} />
            <strong>{story.title}</strong>
            <span>{story.copy}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
