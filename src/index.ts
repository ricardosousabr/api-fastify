import Fastify, { FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
import { getUsersCollection } from './db'
import routes from './routes/index'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
dotenv.config()

const fastify: FastifyInstance = Fastify({
  logger: true,
})

fastify.register(routes)

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

async function startServer() {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    })
    fastify.log.info(
      `Servidor rodando em: http://localhost:${process.env.PORT || 3000}`
    )
  } catch (error) {
    fastify.log.error('Erro ao iniciar o servidor:', error)
    process.exit(1)
  }
}

getUsersCollection().then(startServer)
