const faqs = [
  {
    q: 'Do I need an account to shop?',
    a: 'Browse without signing in. After you add jewelry to the cart, checkout asks for name, email, and phone. That saves your customer record.',
  },
  {
    q: 'How do I place an order?',
    a: 'Add jewelry on the wall, press Done, then send name, email, phone, and address. We email you that the order is placed. No password.',
  },
  {
    q: 'What if a piece is out of stock?',
    a: 'The shop shows how many pieces are left. Out of stock jewelry stays on the wall but cannot go in the cart until the studio adds quantity again.',
  },
  {
    q: 'Where do you ship?',
    a: 'Orders leave the Lahore studio and go across Pakistan. Delivery time is quoted after we confirm your order.',
  },
  {
    q: 'What wrist sizes do you keep?',
    a: 'Most pieces are listed with 2.2, 2.4, and 2.6. Write to the studio if you need a size held for a bridal set.',
  },
  {
    q: 'Can I return or exchange?',
    a: 'Write within three days of delivery if a piece is unused and in its packing. Bridal sets made or held for a date are not returned.',
  },
  {
    q: 'How do I write to the studio?',
    a: 'Open Contact and tap Write to the studio. That opens Gmail to the studio inbox.',
  },
]

export function FaqPage() {
  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Help</p>
        <h2 className="has-rule">
          Questions we get <em>often</em>
        </h2>
        <p className="lede">Shipping, accounts, sizes, and how an order leaves Lahore.</p>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
