import { ObjectId, type Collection, type WithId } from 'mongodb'
import { isProductCategory, isStockCount } from '../shared/types.ts'
import type { CreateProductInput, Product, ProductId } from '../shared/types.ts'
import { getDb } from './db.ts'

interface ProductDocument {
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
  stock: number
}

export class ProductStore {
  private collection(): Collection<ProductDocument> {
    return getDb().collection<ProductDocument>('products')
  }

  private toObjectId(id: ProductId): ObjectId | null {
    if (!ObjectId.isValid(id)) {
      return null
    }

    return new ObjectId(id)
  }

  private toProduct(doc: WithId<ProductDocument>): Product {
    if (!isProductCategory(doc.category)) {
      throw new Error(`Invalid category in database: ${doc.category}`)
    }

    return {
      id: doc._id.toHexString(),
      title: doc.title,
      price: doc.price,
      description: doc.description,
      category: doc.category,
      image: doc.image,
      rating: doc.rating,
      stock: isStockCount(doc.stock) ? doc.stock : 8,
    }
  }

  public async backfillStock(defaultStock = 8): Promise<number> {
    const result = await this.collection().updateMany(
      { $or: [{ stock: { $exists: false } }, { stock: { $type: 'null' } }] },
      { $set: { stock: defaultStock } },
    )
    return result.modifiedCount
  }

  public async findAll(): Promise<Product[]> {
    // MongoDB find()  =  SQL: SELECT * FROM products
    const docs = await this.collection().find().toArray()
    return docs.map((doc) => this.toProduct(doc))
  }

  public async findById(id: ProductId): Promise<Product | undefined> {
    const objectId = this.toObjectId(id)
    if (!objectId) {
      return undefined
    }

    // MongoDB findOne()  =  SQL: SELECT * FROM products WHERE id = ?
    const doc = await this.collection().findOne({ _id: objectId })
    return doc ? this.toProduct(doc) : undefined
  }

  public async insert(input: CreateProductInput): Promise<Product> {
    const document: ProductDocument = {
      ...input,
      rating: { rate: 0, count: 0 },
    }

    // MongoDB insertOne()  =  SQL: INSERT INTO products (...)
    const result = await this.collection().insertOne(document)
    return this.toProduct({ _id: result.insertedId, ...document })
  }

  public async update(id: ProductId, input: CreateProductInput): Promise<Product | undefined> {
    const objectId = this.toObjectId(id)
    if (!objectId) {
      return undefined
    }

    // MongoDB updateOne()  =  SQL: UPDATE products SET ... WHERE id = ?
    const result = await this.collection().findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: 'after' },
    )

    return result ? this.toProduct(result) : undefined
  }

  public async remove(id: ProductId): Promise<boolean> {
    const objectId = this.toObjectId(id)
    if (!objectId) {
      return false
    }

    // MongoDB deleteOne()  =  SQL: DELETE FROM products WHERE id = ?
    const result = await this.collection().deleteOne({ _id: objectId })
    return result.deletedCount === 1
  }

  public async setStock(id: ProductId, stock: number): Promise<Product | undefined> {
    const objectId = this.toObjectId(id)
    if (!objectId) {
      return undefined
    }

    const result = await this.collection().findOneAndUpdate(
      { _id: objectId },
      { $set: { stock } },
      { returnDocument: 'after' },
    )
    return result ? this.toProduct(result) : undefined
  }

  public async changeStock(id: ProductId, quantity: number): Promise<Product | undefined> {
    const objectId = this.toObjectId(id)
    if (!objectId || quantity === 0) {
      return undefined
    }

    const filter =
      quantity < 0 ? { _id: objectId, stock: { $gte: Math.abs(quantity) } } : { _id: objectId }

    const result = await this.collection().findOneAndUpdate(
      filter,
      { $inc: { stock: quantity } },
      { returnDocument: 'after' },
    )
    return result ? this.toProduct(result) : undefined
  }

  public async seedIfEmpty(products: Omit<Product, 'id'>[]): Promise<number> {
    const count = await this.collection().countDocuments()
    if (count > 0) {
      return 0
    }

    const result = await this.collection().insertMany(products)
    return result.insertedCount
  }

  public async applyStockByTitle(rows: { title: string; stock: number }[]): Promise<number> {
    let updated = 0
    for (const row of rows) {
      const result = await this.collection().updateOne({ title: row.title }, { $set: { stock: row.stock } })
      updated += result.modifiedCount
    }
    return updated
  }

  public async replaceAll(products: Omit<Product, 'id'>[]): Promise<number> {
    await this.collection().deleteMany({})
    const result = await this.collection().insertMany(products)
    return result.insertedCount
  }
}
