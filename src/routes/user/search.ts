import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'

const paramsSchema = z.object({
  name: z
    .string()
    .min(4, 'Name must have at least 4 characters')
    .max(15, 'The name is too big, it must have up to 15 characters')
    .regex(RegExp('^[A-Za-z]+$'), 'Name must contain only letters'),
})

export default async (app: FastifyInstance) => {
  app.get(
    '/user/:name',
    {
      schema: {
        tags: ['User'],
        description: 'Retrieve a user by name',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the user (4-15 letters)',
            },
          },
          required: ['name'],
        },
        response: {
          200: {
            description: 'User found',
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  // Adicione outros campos retornados do seu documento
                },
              },
            },
          },
          400: {
            description: 'Invalid name param',
            type: 'object',
            properties: {
              error: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
      preHandler: [app.authenticate], // Middleware de autenticação
    },
    async (req, res) => {
      const parseResult = paramsSchema.safeParse(req.params)
      if (!parseResult.success) {
        return res.status(400).send({
          error: parseResult.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        })
      }

      const { name } = parseResult.data

      try {
        const usersCollection = await getUsersCollection()

        const user = await usersCollection.findOne(
          { name },
          { projection: { password: 0 } } // Exclui o campo `password`
        )

        if (!user) {
          return res.status(404).send({
            error: `User with name "${name}" not found`,
          })
        }

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
    }
  )
}
