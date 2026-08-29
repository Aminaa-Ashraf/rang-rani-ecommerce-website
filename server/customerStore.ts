import { ObjectId, type Collection, type WithId } from 'mongodb'
import type { Customer } from '../shared/types.ts'
import { getDb } from './db.ts'
import { checkPassword, createToken, hashPassword } from './password.ts'

interface CustomerDocument {
  name: string
  email: string
  phone: string
  city: string
  address: string
  passwordHash: string
  token?: string
}

export class EmailTakenError extends Error {
  readonly statusCode = 409

  constructor() {
    super('This email already has an account')
    this.name = 'EmailTakenError'
  }
}

export class AuthFailedError extends Error {
  readonly statusCode = 401

  constructor() {
    super('Email or password is wrong')
    this.name = 'AuthFailedError'
  }
}

export class CustomerStore {
  private collection(): Collection<CustomerDocument> {
    return getDb().collection<CustomerDocument>('customers')
  }

  public async ensureIndexes(): Promise<void> {
    await this.collection().createIndex({ email: 1 }, { unique: true })
  }

  private toCustomer(doc: WithId<CustomerDocument>): Customer {
    return {
      id: doc._id.toHexString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      city: doc.city,
      address: doc.address,
    }
  }

  public async register(input: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<{ token: string; customer: Customer }> {
    const email = input.email.trim().toLowerCase()
    const existing = await this.collection().findOne({ email })
    if (existing) {
      throw new EmailTakenError()
    }

    const token = createToken()
    const result = await this.collection().insertOne({
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      city: '',
      address: '',
      passwordHash: hashPassword(input.password),
      token,
    })

    return {
      token,
      customer: {
        id: result.insertedId.toHexString(),
        name: input.name.trim(),
        email,
        phone: input.phone.trim(),
        city: '',
        address: '',
      },
    }
  }

  public async login(email: string, password: string): Promise<{ token: string; customer: Customer }> {
    const doc = await this.collection().findOne({ email: email.trim().toLowerCase() })
    if (!doc || !checkPassword(password, doc.passwordHash)) {
      throw new AuthFailedError()
    }

    const token = createToken()
    await this.collection().updateOne({ _id: doc._id }, { $set: { token } })
    return { token, customer: this.toCustomer(doc) }
  }

  public async findByToken(token: string): Promise<Customer | null> {
    const doc = await this.collection().findOne({ token })
    return doc ? this.toCustomer(doc) : null
  }

  public async logout(token: string): Promise<void> {
    await this.collection().updateOne({ token }, { $unset: { token: '' } })
  }

  public async updateContact(
    id: string,
    patch: { name?: string; phone?: string; city?: string; address?: string },
  ): Promise<Customer | null> {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(patch.name ? { name: patch.name.trim() } : {}),
          ...(patch.phone ? { phone: patch.phone.trim() } : {}),
          ...(patch.city !== undefined ? { city: patch.city.trim() } : {}),
          ...(patch.address !== undefined ? { address: patch.address.trim() } : {}),
        },
      },
      { returnDocument: 'after' },
    )

    return result ? this.toCustomer(result) : null
  }
}
