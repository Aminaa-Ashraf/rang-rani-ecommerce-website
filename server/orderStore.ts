import { ObjectId, type Collection, type WithId } from 'mongodb'
import type { OrderItem, ShopOrder } from '../shared/types.ts'
import { getDb } from './db.ts'

interface OrderDocument {
  customerId: ObjectId
  items: OrderItem[]
  total: number
  city: string
  address: string
  createdAt: Date
}

export class OrderStore {
  private collection(): Collection<OrderDocument> {
    return getDb().collection<OrderDocument>('orders')
  }

  private toOrder(doc: WithId<OrderDocument>): ShopOrder {
    return {
      id: doc._id.toHexString(),
      items: doc.items,
      total: doc.total,
      city: doc.city,
      address: doc.address,
      createdAt: doc.createdAt.toISOString(),
    }
  }

  public async create(input: {
    customerId: string
    items: OrderItem[]
    total: number
    city: string
    address: string
  }): Promise<ShopOrder> {
    const createdAt = new Date()
    const result = await this.collection().insertOne({
      customerId: new ObjectId(input.customerId),
      items: input.items,
      total: input.total,
      city: input.city,
      address: input.address,
      createdAt,
    })

    return {
      id: result.insertedId.toHexString(),
      items: input.items,
      total: input.total,
      city: input.city,
      address: input.address,
      createdAt: createdAt.toISOString(),
    }
  }

  public async listForCustomer(customerId: string): Promise<ShopOrder[]> {
    const rows = await this.collection()
      .find({ customerId: new ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .toArray()
    return rows.map((row) => this.toOrder(row))
  }
}
