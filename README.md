# Rang Rani

A Lahore jewelry shop — browse the wall, add pieces, and send an order without a separate sign-in page.

Beaded, kundan, charm, and bridal collections · PKR · Vite + React + Firebase

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

## License

[MIT](LICENSE) · [@Aminaa-Ashraf](https://github.com/Aminaa-Ashraf)
