import { FastifyInstance } from 'fastify'
import create from './user/create'
import search from './user/search'
import deleteUser from './user/delete'
import update from './user/update'
import login from './user/login'

export default async (app: FastifyInstance) => {
  app.register(create)
  app.register(search)
  app.register(deleteUser)
  app.register(update)
  app.register(login)
}
