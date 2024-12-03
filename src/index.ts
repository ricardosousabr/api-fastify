import Fastify, { FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
dotenv.config()

const fastify: FastifyInstance = Fastify({
  logger: true,
})

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

fastify.withTypeProvider<ZodTypeProvider>().route({
  method: 'POST',
  url: '/login',
  schema: {
    body: z
      .object({
        userName: z.string().min(6).max(10),
      })
      .required(),
    response: {
      200: z.string(),
    },
  },
  handler: (req, res) => {
    res.send(req.body.userName)
  },
})

try {
  await fastify.listen({ port: Number(process.env.PORT) })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
