# Rang Rani

A Lahore jewelry shop - browse the wall, add pieces, and send an order without a separate sign-in page.

Beaded, kundan, charm, and bridal collections · PKR · Vite + React + Firebase

<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
  <img alt="CSS" src="https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" />
</p>

---

## What it does

- Shop four collections with live stock (low / out of stock on the wall)
- Add to cart on the card, change quantity, then press Done to check out
- Save the customer and order in Firebase (name, email, phone, address)
- Queue an order confirmation email in Firestore (`mail`)
- Keep catalog writes behind studio admin (`/admin`)

## Stack

| Layer | Choice |
|-------|--------|
| App | Vite, React 19, TypeScript |
| API | Express on `/api` (MongoDB Atlas catalog + stock) |
| Auth / orders | Firebase Auth + Firestore |
| UI | Custom CSS (cream, gold, chocolate) |
| Admin | Password-gated catalog + stock |

## Quick start

```bash
npm install
cp .env.example .env
# set MONGODB_URI, MONGODB_DB, and ADMIN_KEY
npm run dev
```

Shop: [http://localhost:5173](http://localhost:5173)  
Admin: [http://localhost:5173/admin](http://localhost:5173/admin)

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/shop` | Jewelry wall, cart, checkout |
| `/collections` | Four families |
| `/about` | Studio story |
| `/faq` | Common questions |
| `/contact` | Write to the studio |
| `/account` | Orders (after checkout) |
| `/admin` | Catalog and stock |

## Environment

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas or local Mongo connection |
| `MONGODB_DB` | Database name |
| `ADMIN_KEY` | Studio admin password |

## Scripts

```bash
npm run dev
npm run build
```

## Built with

This shop is **TypeScript + React**, not separate `.html` pages like the bus-tracking project. GitHub's language bar therefore shows TypeScript and CSS first, with a small HTML file (`index.html`).

| Badge | Role |
|-------|------|
| TypeScript | App, API, and shared types |
| React + Vite | Shop and admin UI |
| CSS | Layout and theme (no Tailwind) |
| Express | Catalog and stock API |
| MongoDB | Product inventory |
| Firebase | Customers, orders, confirmation mail |

## License

[MIT](LICENSE) · [@Aminaa-Ashraf](https://github.com/Aminaa-Ashraf)
