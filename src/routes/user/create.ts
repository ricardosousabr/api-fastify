import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'

// Esquema Zod para validação
const bodySchema = z.object({
  name: z
    .string()
    .min(4, 'Name must have at least 4 characters')
    .max(15, 'The name is too big, it must have up to 15 characters')
    .regex(RegExp('^[A-Za-z]+$'), 'Name must contain only letters'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .max(15, 'The password is too big, it must have up to 15 characters'),
})

export default async (app: FastifyInstance) => {
  app.post('/user', async (req, res) => {
    console.log('Request body:', req.body)

    // Validação do corpo da requisição
    const parseResult = bodySchema.safeParse(req.body)
    if (!parseResult.success) {
      console.log('Validation failed:', parseResult.error.errors)
      return res.status(400).send({
        error: parseResult.error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    const { name, password } = parseResult.data

    try {
      const usersCollection = await getUsersCollection()

      // Insere o documento na coleção
      const result = await usersCollection.insertOne({
        name,
        password,
        createdAt: new Date(), // Adiciona um timestamp
      })

      console.log('User saved:', result)
      res.send({
        message: 'User created successfully',
        userId: result.insertedId,
      })
    } catch (error) {
      console.error('Error saving user:', error)
      res.status(500).send({
        error: 'Internal server error',
      })
    }
  })
}
