import Fastify, { FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
//import createUser from './routes/user/create'
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

//fastify.register(createUser)

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

// fastify.withTypeProvider<ZodTypeProvider>().route({
//   method: 'POST',
//   url: '/login',
//   schema: {
//     body: z
//       .object({
//         userName: z.string().min(6).max(10),
//       })
//       .required(),
//     response: {
//       200: z.string(),
//     },
//   },
//   handler: (req, res) => {
//     res.send(req.body.userName)
//   },
// })

fastify.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/user/:name',
  schema: {
    params: z.object({
      name: z.string().min(4),
    }),
    response: {
      200: z.string(),
    },
  },
  handler: (req, res) => {
    res.send(req.params.name)
  },
})

fastify.withTypeProvider<ZodTypeProvider>().route({
  method: 'PUT',
  url: '/user/:id',
  schema: {
    params: z.object({
      id: z.string().min(5).max(15),
    }),
    response: {
      200: z.string(),
    },
  },
  handler: (req, res) => {
    const newName = 'Maria'
    const user = {
      id: '12345',
      name: 'Ricardo',
    }

    user.name = newName
    res.send(`User with ID: ${user.name} updated`)
  },
})

fastify.withTypeProvider<ZodTypeProvider>().route({
  method: 'DELETE',
  url: '/user/:id',
  schema: {
    params: z.object({
      id: z.string().min(5).max(15),
    }),
    response: {
      200: z.string(),
    },
  },
  handler: (req, res) => {
    const user = [
      {
        id: '12345',
        name: 'Ricardo',
      },
      {
        id: '67890',
        name: 'Maria',
      },
    ]

    user.splice(
      user.findIndex((u) => u.id === req.params.id),
      1
    )
    res.send(`User with ID: ${user} deleted`)
  },
})

try {
  await fastify.listen({ port: Number(process.env.PORT), host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
