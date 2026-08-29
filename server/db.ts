import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB ?? 'ecommerce_dashboard'

let client: MongoClient | undefined
let database: Db | undefined

export async function connectDb(): Promise<Db> {
  if (database) {
    return database
  }

  client = new MongoClient(uri)
  await client.connect()
  database = client.db(dbName)
  return database
}

export function getDb(): Db {
  if (!database) {
    throw new Error('MongoDB is not connected. Call connectDb() first.')
  }

  return database
}

export async function closeDb(): Promise<void> {
  await client?.close()
  client = undefined
  database = undefined
}
