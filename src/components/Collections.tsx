import { ProductCategory } from '../../shared/types'
import { Link } from '../lib/nav'

const stories = [
  {
    category: ProductCategory.Beaded,
    title: 'Beaded Bracelets',
    copy: 'For stacking on a regular day.',
    image: '/images/peela-moti-line.jpg',
  },
  {
    category: ProductCategory.Kundan,
    title: 'Kundan Bangles',
    copy: 'When you want the gold to catch the light.',
    image: '/images/kundan-cover.jpg',
  },
  {
    category: ProductCategory.Charm,
    title: 'Charm Bracelets',
    copy: 'The playful ones — roses, smileys, hearts.',
    image: '/images/rose-beads.jpg',
  },
  {
    category: ProductCategory.Bridal,
    title: 'Bridal Bangles',
    copy: 'For the week of the wedding.',
    image: '/images/gulabi-chooda.jpg',
  },
] as const

export function Collections() {
  return (
    <section className="section" id="collections">
      <div>
        <p className="eyebrow">On the wall</p>
        <h2 className="has-rule">
          Take the one that <em>feels</em> like you.
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
