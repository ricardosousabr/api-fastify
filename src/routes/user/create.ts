import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'
import bcrypt from 'bcryptjs'

// Schema Zod para validação (usado internamente)
const userSchema = z.object({
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
  app.post(
    '/user',
    {
      schema: {
        tags: ['User'],
        description: 'Create a new user',
        summary: 'Create a new user',
        security: [],
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the user (4-15 letters)',
              minLength: 4,
              maxLength: 15,
            },
            password: {
              type: 'string',
              description: 'Password of the user (8-15 characters)',
              minLength: 8,
              maxLength: 15,
            },
          },
          required: ['name', 'password'],
        },
        response: {
          200: {
            description: 'User created successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
              userId: { type: 'string' },
            },
          },
          400: {
            description: 'Bad Request – Invalid input or user already exists',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (req, res) => {
      console.log('Request body:', req.body)

      // Valida os dados com o Zod
      const parseResult = userSchema.safeParse(req.body)
      if (!parseResult.success) {
        return res.status(400).send({
          error: parseResult.error.errors
            .map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            }))
            .join(', '),
        })
      }

      const { name, password } = parseResult.data

      try {
        const usersCollection = await getUsersCollection()

        // Verifica se o usuário já existe
        const existingUser = await usersCollection.findOne({ name })
        if (existingUser) {
          return res.status(400).send({ error: 'User already exists' })
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await usersCollection.insertOne({
          name,
          password: hashedPassword,
          createdAt: new Date(),
        })

        res.send({
          message: 'User created successfully',
          userId: result.insertedId,
        })
      } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).send({ error: 'Internal server error' })
      }
    }
  )
}
