import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Jewelry · Lahore</p>
          <h1>
            Royal jewelry <em>refined</em> for every day
          </h1>
          <p className="lede">
            Bridal sets, stacked beads, and gold pieces — worn from mehndi night to everyday.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/shop">
              Shop collection
            </Link>
            <Link className="btn ghost" to="/about">
              Our story
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img className="hero-photo" src="/images/hero-kangans.jpg" alt="Gold jewelry from the Rang Rani studio" />
        </div>
      </div>
    </section>
  )
}
