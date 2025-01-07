import Fastify, { FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
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

try {
  await fastify.listen({ port: Number(process.env.PORT), host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
