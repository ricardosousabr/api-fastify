import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'
import bcrypt from 'bcrypt'

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
  app.put(
    '/user',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Updates an existing user name and password',
        tags: ['User'], // Agrupa a rota na categoria "users" no Swagger
        summary: 'Update user',
        security: [{ bearerAuth: [] }], // Define que a rota requer autenticação JWT
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Username (4-15 characters, letters only)',
              minLength: 4,
              maxLength: 15,
            },
            password: {
              type: 'string',
              description: 'New user password (8-15 characters)',
              minLength: 8,
              maxLength: 15,
            },
          },
          required: ['name', 'password'],
        },
        response: {
          200: {
            description: 'Update success',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          400: {
            description: 'Validation error',
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

        const existingUser = await usersCollection.findOne({ name })
        if (!existingUser) {
          return res.status(404).send({
            error: `No user found with the name "${name}"`,
          })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const updateResult = await usersCollection.updateOne(
          { name },
          { $set: { password: hashedPassword } }
        )

        if (updateResult.modifiedCount === 0) {
          return res.status(200).send({
            message: `No changes made to user "${name}"`,
          })
        }

        res.send({
          message: `User "${name}" updated successfully`,
        })
      } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).send({
          error: 'Internal server error',
        })
      }
    }
  )
}
