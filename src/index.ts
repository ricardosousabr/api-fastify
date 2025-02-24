import Fastify, { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import dotenv from 'dotenv'
import routes from './routes/index'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

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

fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'API documentation using Swagger',
      version: '1.0.0',
    },
    host: `localhost:${process.env.PORT || 3000}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
})

fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
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
