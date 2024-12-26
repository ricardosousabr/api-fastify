import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Esquema Zod para validação
const bodySchema = z.object({
  name: z
    .string()
    .min(4, 'Name must have at least 4 characters')
    .max(15, 'The name is too big, it must have up to 15 characters')
    .regex(/[a-zA-Z]+/, 'Name must contain only letters'),
})

// Esquema de resposta
//const responseSchema = z.string()

export default async (app: FastifyInstance) => {
  app.get('/user', async (req, res) => {
    // Validação com Zod (safeParse)
    const parseResult = bodySchema.safeParse(req.query)

    if (!parseResult.success) {
      // Retorna erro 400 com os detalhes
      return res.status(400).send({
        error: parseResult.error.errors,
      })
    }

    const { name } = parseResult.data
    res.send(`Hello, ${name}!`)
  })
}
