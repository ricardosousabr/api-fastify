import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'

// Esquema Zod para validação do objeto de parâmetros
const paramsSchema = z.object({
  name: z
    .string()
    .min(4, 'Name must have at least 4 characters')
    .max(15, 'The name is too big, it must have up to 15 characters')
    .regex(RegExp('^[A-Za-z]+$'), 'Name must contain only letters'),
})

export default async (app: FastifyInstance) => {
  app.get('/user/:name', async (req, res) => {
    // Valida o objeto de parâmetros com o Zod
    const parseResult = paramsSchema.safeParse(req.params)
    if (!parseResult.success) {
      return res.status(400).send({
        error: parseResult.error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    const { name } = parseResult.data // Nome validado pelo Zod

    try {
      const usersCollection = await getUsersCollection()

      // Filtra o usuário com base no nome
      const user = await usersCollection.findOne(
        { name }, // Filtro pelo campo `name`
        { projection: { password: 0 } } // Exclui o campo `password` do resultado
      )

      // Caso o usuário não seja encontrado
      if (!user) {
        return res.status(404).send({
          error: `User with name "${name}" not found`,
        })
      }

      // Retorna o usuário encontrado
      res.send({
        message: 'User retrieved successfully',
        user,
      })
    } catch (error) {
      console.error('Error retrieving user:', error)
      res.status(500).send({
        error: 'Internal server error',
      })
    }
  })
}
