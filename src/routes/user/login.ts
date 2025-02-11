import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getUsersCollection } from '../../db'
import bcrypt from 'bcryptjs'

export default async (app: FastifyInstance) => {
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

  app.post('/login', async (req, res) => {
    console.log('Login request:', req.body)

    const parseResult = userSchema.safeParse(req.body)
    if (!parseResult.success) {
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

      const user = await usersCollection.findOne({ name })
      if (!user) {
        return res.status(401).send({ error: 'Invalid credentials' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).send({ error: 'Invalid credentials' })
      }

      const token = app.jwt.sign(
        { userId: user._id, name: user.name },
        { expiresIn: '1h' }
      )

      res.send({ message: 'Login successful', token })
    } catch {
      res.status(500).send({ error: 'Internal server error' })
    }
  })
}
