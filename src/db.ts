import { MongoClient, Db, Collection } from 'mongodb'

const uri = 'mongodb://localhost:27017/'
const client = new MongoClient(uri)

let db: Db

export async function connectToDatabase() {
  if (!db) {
    await client.connect()
    db = client.db('to-do-list-fastify')
    console.log('Connected to MongoDB')
  }
  return db
}

export async function getUsersCollection(): Promise<Collection> {
  const database = await connectToDatabase()
  return database.collection('users')
}
