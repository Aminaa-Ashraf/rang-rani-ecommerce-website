import { STUDIO_EMAIL } from '../lib/contact'

const faqs = [
  {
    q: 'Do I have to make an account first?',
    a: 'No. Look around, add what you like. At checkout we only ask name, email, phone, city, and address. There is no password.',
  },
  {
    q: 'I put things in the cart. What do I do next?',
    a: 'Open the cart, check the pieces, then press Checkout. Fill your details and send the order. We email you when it is in.',
  },
  {
    q: 'Do you deliver outside Lahore?',
    a: 'Yes. We pack here in Lahore and send across Pakistan — Karachi, Islamabad, anywhere we can courier.',
  },
  {
    q: 'How many days will it take?',
    a: 'Depends on your city and the courier. After we confirm the order we tell you the date. Same-week send from Lahore if the piece is in stock.',
  },
  {
    q: 'How do I pay? Is COD okay?',
    a: `We confirm on email first, then send payment and courier details. Only pay the way that message says — and only to ${STUDIO_EMAIL}. If someone else asks for money, it is not us.`,
  },
  {
    q: 'Will I get the same piece as the photo?',
    a: 'Yes, that is the piece on the wall. Beads and kundan can sit a little differently in real light, but it is not a different design.',
  },
  {
    q: 'How do I know my size?',
    a: 'Most pieces are 2.2, 2.4, or 2.6. Measure where the bangle sits, not the knuckles. If you are between sizes or need a bridal set held, email us the size before you order.',
  },
  {
    q: 'It says out of stock. Can I still get it?',
    a: 'Not right now — that count is real. Email us the name of the piece. If a new lot is coming, we will say so. Do not pay anyone for a restock promise on WhatsApp.',
  },
  {
    q: 'I need it for a shaadi. Can you hold it?',
    a: 'Yes, if it is still in stock. Email the date, city, and which set. Held bridal pieces cannot be returned once we put them aside for you.',
  },
  {
    q: 'If it does not fit, can I return it?',
    a: 'Write within three days of delivery. The piece should be unused and in the same packing. We do not take back bridal sets that were made or held for a date.',
  },
  {
    q: 'How do I know you got my order?',
    a: 'You get a thank-you email after you place it. If nothing lands in 10 minutes, check spam, then email us from the same address you used at checkout.',
  },
]

export function FaqPage() {
  return (
    <main className="page page-shell">
      <section className="section">
        <p className="eyebrow">Help</p>
        <h2 className="has-rule">
          Before you <em>order</em>
        </h2>
        <p className="lede">
          These come up a lot. Anything else — email {STUDIO_EMAIL}.
        </p>
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
