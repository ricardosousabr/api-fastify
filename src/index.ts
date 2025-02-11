import Fastify, { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import dotenv from 'dotenv'
import routes from './routes/index'

dotenv.config()

const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
})

fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})

fastify.register(routes)

async function startServer() {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000 })
    console.log(
      `🚀 Servidor rodando em http://localhost:${process.env.PORT || 3000}`
    )
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error)
    process.exit(1)
  }
}

startServer()
