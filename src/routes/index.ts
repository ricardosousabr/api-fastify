import { FastifyInstance } from 'fastify'
import create from './user/create'
import search from './user/search'

export default async (app: FastifyInstance) => {
  app.register(create)
  app.register(search)
}
