import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const bodySchema = z.object({
  name: z
    .string()
    .min(4, 'Name must have at least 4 characters')
    .max(15, 'The name is too big, it must have up to 15 characters')
    .regex(RegExp('^[A-Za-z]+$'), 'Name must contain only letters'),
  password: z
    .string()
    .min(8, 'Password must have at least 4 characters')
    .max(15, 'The password is too big, it must have up to 15 characters'),
})

export default async (app: FastifyInstance) => {
  app.put('/user/:name', async (req, res) => {
    res.send('Hello World')
  })
}
