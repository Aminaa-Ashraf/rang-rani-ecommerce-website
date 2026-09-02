# Rang Rani

A Lahore shop for bangles and bracelets — browse the wall, bag a piece, and place an order without a password.

Four collections · PKR · Next.js + Express + MongoDB + Firebase

<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" />
</p>

---

## What it does

- Shop Beaded, Kundan, Charm, and Bridal collections with live stock
- Search the wall (typos still find the piece)
- Add to cart, change quantity in the bag, then view cart or check out
- Guest checkout — name, email, phone, city, address only
- Thank-you page after the order, plus a studio review form
- Admin catalog for pieces, stock, and reviews

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js 15 (App Router), React 19, TypeScript |
| API | Express on `/api` |
| Catalog | MongoDB Atlas |
| Auth / orders | Firebase Auth + Cloud Firestore |
| UI | Custom CSS (ivory, gold, maroon) |
| Admin | JWT after studio password at `/admin` |

## Quick start

```bash
npm install
cp .env.example .env
# set MONGODB_URI, MONGODB_DB, and ADMIN_KEY
npm run dev
```

Shop: [http://localhost:5173](http://localhost:5173)  
Admin: [http://localhost:5173/admin](http://localhost:5173/admin)

On Vercel, set the same env vars and allow Atlas access from `0.0.0.0/0` (Network Access). The Next.js app serves `/api` on the same host.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home and collections |
| `/shop` | The wall |
| `/cart` | Full cart |
| `/checkout` | Guest checkout |
| `/thanks` | Order confirmed |
| `/about` | Studio story |
| `/faq` | Common questions |
| `/contact` | Leave a review |
| `/admin` | Catalog, stock, reviews |

## Environment

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas or local Mongo connection |
| `MONGODB_DB` | Database name |
| `ADMIN_KEY` | Studio admin password (login only) |
| `JWT_SECRET` | Signs admin JWTs (optional locally; set on Vercel) |
| `SMTP_USER` / `SMTP_PASS` | Optional order email (Gmail App Password) |

## Scripts

```bash
npm run dev
npm run build
```

## License

[MIT](LICENSE) · [@Aminaa-Ashraf](https://github.com/Aminaa-Ashraf)
