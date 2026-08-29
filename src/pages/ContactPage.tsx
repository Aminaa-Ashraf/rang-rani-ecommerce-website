import { STUDIO_MAIL } from '../lib/contact.ts'

export function ContactPage() {
  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Contact</p>
        <h2 className="has-rule">
          Visit the <em>studio</em>
        </h2>
        <p className="lede">Write from Lahore or anywhere in Pakistan. We pack jewelry in the studio.</p>
        <div className="contact-grid">
          <article className="lift-card">
            <p className="eyebrow">Write</p>
            <a href={STUDIO_MAIL}>Write to the studio</a>
            <p className="muted">Questions, bridal holds, and order notes.</p>
          </article>
          <article className="lift-card">
            <p className="eyebrow">Site</p>
            <p>rangrani.pk</p>
            <p className="muted">The shop address. Brand name stays Rang Rani.</p>
          </article>
          <article className="lift-card">
            <p className="eyebrow">Studio</p>
            <p>Lahore</p>
            <p className="muted">Packed here · ships across the country.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
