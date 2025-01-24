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
  app.put('/user', async (req, res) => {
    // Valida o corpo da requisição
    const validation = bodySchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).send({
        error: validation.error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    const { name, password } = validation.data

    try {
      const usersCollection = await getUsersCollection()

      // Atualiza o documento correspondente no banco
      const updateResult = await usersCollection.updateOne(
        { name }, // Condição para encontrar o documento
        { $set: { password } } // Atualização dos dados
      )

      if (updateResult.matchedCount === 0) {
        return res.status(404).send({
          error: `No user found with the name "${name}"`,
        })
      }

      res.send({
        message: `User "${name}" updated successfully`,
        updatedFields: { name, password },
      })
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).send({
        error: 'Internal server error',
      })
    }
  })
}
