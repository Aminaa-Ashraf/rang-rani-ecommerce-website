import { Link } from '../lib/nav'

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">From our table in Lahore</p>
          <h1>
            Bangles from Lahore, <em>worn</em> on yours
          </h1>
          <p className="lede">
            Moti for Tuesday, kundan for shine, a bridal stack when the week of the shaadi starts.
            Nothing extra on the wall.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/shop">
              See the wall
            </Link>
            <Link className="btn ghost" to="/about">
              How we started
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img className="hero-photo" src="/images/hero-kangans.jpg" alt="Gold bangles from the Rang Rani studio" />
        </div>
      </div>
    </section>
  )
}
