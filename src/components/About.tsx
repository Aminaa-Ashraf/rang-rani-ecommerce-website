export function About() {
  return (
    <section className="section" id="about">
      <div className="about-band">
        <div className="about-copy">
          <p className="eyebrow">Our story</p>
          <h2 className="has-rule">
            A jewelry studio from <em>Lahore</em>
          </h2>
          <p className="lede">
            Rang Rani began on a small table in Lahore — moti counted by hand, kundan sets
            chosen for shaadi, charms picked for stacking. The wall is still short on purpose.
          </p>
          <p className="lede">
            We keep four families only: beaded, kundan, charm, and bridal. Everyday stacks sit
            next to mehndi-night sets because that is how jewelry is actually worn here — from
            the market run to the shaadi hall.
          </p>
          <p className="lede">
            Every order is packed in the studio and sent across Pakistan the same week. No
            warehouse dump, no extra country on the box. Just Rang Rani, from Lahore.
          </p>
        </div>
        <div className="about-visual">
          <img src="/images/filigree-set.jpg" alt="Gold filigree bangle and matching ring" />
        </div>
      </div>
      <div className="story-grid">
        <article className="lift-card">
          <p className="eyebrow">The wall</p>
          <h3>Four collections, nothing extra</h3>
          <p>Beads for stacking, kundan for shine, charms for play, bridal for the week of the wedding.</p>
        </article>
        <article className="lift-card">
          <p className="eyebrow">The batch</p>
          <h3>Chosen, not dumped</h3>
          <p>Small lots so each piece has a place on the wrist — not another row in a crowded catalog.</p>
        </article>
        <article className="lift-card">
          <p className="eyebrow">The send</p>
          <h3>Packed in Lahore</h3>
          <p>Wrapped in the studio and shipped across the country. Write to us if you want a bridal set held.</p>
        </article>
      </div>
    </section>
  )
}
