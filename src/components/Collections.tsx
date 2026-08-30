import { Link } from 'react-router-dom'
import { ProductCategory } from '../../shared/types.ts'

const stories = [
  {
    category: ProductCategory.Beaded,
    title: 'Beaded Bracelets',
    copy: 'Moti stacks and everyday beads.',
    image: '/images/peela-moti-line.jpg',
  },
  {
    category: ProductCategory.Kundan,
    title: 'Kundan Bangles',
    copy: 'Shaadi-ready shine.',
    image: '/images/kundan-cover.jpg',
  },
  {
    category: ProductCategory.Charm,
    title: 'Charm Bracelets',
    copy: 'Smileys, roses, and charm wraps.',
    image: '/images/rose-beads.jpg',
  },
  {
    category: ProductCategory.Bridal,
    title: 'Bridal Bangles',
    copy: 'Bangles and sets for shaadi.',
    image: '/images/gulabi-chooda.jpg',
  },
] as const

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
          <Link
            key={story.category}
            className={`collection-card${story.image ? '' : ' is-empty'}`}
            to={`/shop?category=${story.category}`}
          >
            {story.image ? <img src={story.image} alt="" /> : <span className="collection-photo-empty" aria-hidden="true" />}
            <span className="collection-card-copy">
              <strong>{story.title}</strong>
              <span>{story.copy}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
