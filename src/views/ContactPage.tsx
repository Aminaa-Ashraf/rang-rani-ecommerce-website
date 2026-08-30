'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ProductApi } from '../api/client'
import { loadCustomer, watchAuth } from '../lib/shopAuth'

const api = new ProductApi()

export function ContactPage() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [review, setReview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    return watchAuth((user) => {
      if (!user) {
        return
      }
      void loadCustomer(user.uid).then((record) => {
        if (!record) {
          return
        }
        setName((current) => current || record.name)
        setEmail((current) => current || record.email)
      })
    })
  }, [])

  function closeReview(): void {
    setOpen(false)
    setError(null)
    setSaving(false)
    if (sent) {
      setReview('')
      setSent(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await api.sendReview({ name, email, text: review })
      setSent(true)
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send the review')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Contact</p>
        <h2 className="has-rule">
          Visit the <em>studio</em>
        </h2>
        <p className="lede">Write from Lahore or anywhere in Pakistan. We pack jewelry in the studio.</p>
        <div className="contact-grid">
          <button className="lift-card" type="button" onClick={() => setOpen(true)}>
            <p className="eyebrow">Write</p>
            <p>Write to the studio</p>
            <p className="muted">Leave a review.</p>
          </button>
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

      {open ? (
        <div className="overlay" onClick={closeReview} role="presentation">
          <form
            className="panel form"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => void handleSubmit(event)}
          >
            <button className="btn ghost" type="button" onClick={closeReview}>
              Close
            </button>
            {sent ? (
              <>
                <h2 className="has-rule">
                  Thank <em>you</em>
                </h2>
                <p className="muted">We have your review.</p>
              </>
            ) : (
              <>
                <h2 className="has-rule">
                  Leave a <em>review</em>
                </h2>
                <label>
                  Name
                  <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                <label>
                  Review
                  <textarea
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    required
                    minLength={4}
                  />
                </label>
                {error ? <p className="error">{error}</p> : null}
                <button className="btn primary" type="submit" disabled={saving}>
                  {saving ? 'Sending...' : 'Send review'}
                </button>
              </>
            )}
          </form>
        </div>
      ) : null}
    </main>
  )
}
