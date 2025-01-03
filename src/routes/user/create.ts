import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Esquema Zod para validação
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

// Esquema de resposta
//const responseSchema = z.string()

export default async (app: FastifyInstance) => {
  app.post('/user', async (req, res) => {
    const parseResult = bodySchema.safeParse(req.body)

    if (!parseResult.success) {
      return res.status(400).send({
        error: parseResult.error.errors,
      })
    }

    const { name, password } = parseResult.data
    res.send({ name, password })
  })
}
