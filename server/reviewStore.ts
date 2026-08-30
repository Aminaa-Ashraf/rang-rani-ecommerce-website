import type { Collection } from 'mongodb'
import { getDb } from './db.ts'

export interface ShopReview {
  id: string
  name: string
  email: string
  text: string
  createdAt: string
}

interface ShopperDoc {
  email: string
  name: string
  orderedAt: Date
}

interface ReviewDoc {
  name: string
  email: string
  text: string
  createdAt: Date
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export class ReviewStore {
  private shoppers(): Collection<ShopperDoc> {
    return getDb().collection<ShopperDoc>('review_shoppers')
  }

  private reviews(): Collection<ReviewDoc> {
    return getDb().collection<ReviewDoc>('reviews')
  }

  public async rememberOrder(name: string, email: string): Promise<void> {
    const key = normalizeEmail(email)
    await this.shoppers().updateOne(
      { email: key },
      { $set: { email: key, name: name.trim(), orderedAt: new Date() } },
      { upsert: true },
    )
  }

  public async hasOrder(email: string): Promise<boolean> {
    const row = await this.shoppers().findOne({ email: normalizeEmail(email) })
    return Boolean(row)
  }

  public async findReview(email: string): Promise<ShopReview | null> {
    const row = await this.reviews().findOne({ email: normalizeEmail(email) })
    if (!row) {
      return null
    }
    return {
      id: String(row._id),
      name: row.name,
      email: row.email,
      text: row.text,
      createdAt: row.createdAt.toISOString(),
    }
  }

  public async addReview(name: string, email: string, text: string): Promise<ShopReview> {
    const createdAt = new Date()
    const key = normalizeEmail(email)
    const result = await this.reviews().insertOne({
      name: name.trim(),
      email: key,
      text: text.trim(),
      createdAt,
    })
    return {
      id: result.insertedId.toHexString(),
      name: name.trim(),
      email: key,
      text: text.trim(),
      createdAt: createdAt.toISOString(),
    }
  }

  public async list(): Promise<ShopReview[]> {
    const rows = await this.reviews().find().sort({ createdAt: -1 }).toArray()
    return rows.map((row) => ({
      id: String(row._id),
      name: row.name,
      email: row.email,
      text: row.text,
      createdAt: row.createdAt.toISOString(),
    }))
  }
}
