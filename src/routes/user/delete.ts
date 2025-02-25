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
  app.delete(
    '/user/:name',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        description: 'Delete a user by name',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the user (4-15 letters)',
              minLength: 4,
              maxLength: 15,
            },
          },
          required: ['name'],
        },
        response: {
          200: {
            description: 'User(s) deleted successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          400: {
            description: 'Invalid parameters',
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

        const deleteResult = await usersCollection.deleteMany({ name })

        if (deleteResult.deletedCount === 0) {
          return res.status(404).send({
            error: `No users found with the name "${name}"`,
          })
        }

        res.send({
          message: `${deleteResult.deletedCount} user(s) deleted successfully`,
        })
      } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).send({
          error: 'Internal server error',
        })
      }
    }
  )
}
