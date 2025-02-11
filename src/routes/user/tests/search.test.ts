import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import supertest from 'supertest'
import { getUsersCollection } from '../../../db'

jest.mock('../../../db', () => ({
  getUsersCollection: jest.fn(),
}))

describe('User Router - GET /user/:name (com mocks)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = fastify()

    // 🔹 Registra a rota sem autenticação
    await app.register(
      (instance: FastifyInstance, _: any, done: () => void) => {
        instance.route({
          method: 'GET',
          url: '/user/:name',
          handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const { name } = request.params as { name: string }

            if (name.length < 4) {
              return reply.code(400).send({
                error: [
                  {
                    path: 'name',
                    message: 'Name must have at least 4 characters',
                  },
                ],
              })
            }

            const usersCollection = await getUsersCollection()
            const user = await usersCollection.findOne({ name })

            if (!user) {
              return reply
                .code(404)
                .send({ error: `User with name "${name}" not found` })
            }

            return reply
              .code(200)
              .send({ message: 'User retrieved successfully', user })
          },
        })
        done()
      }
    )

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and the user if the name is valid', async () => {
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue({ _id: '1', name: 'JohnDoe' }),
    }
    ;(getUsersCollection as jest.Mock).mockResolvedValue(mockCollection)

    const response = await supertest(app.server).get('/user/JohnDoe')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User retrieved successfully')
    expect(response.body.user).toMatchObject({ name: 'JohnDoe' })
    expect(response.body.user).toHaveProperty('_id')
  })

  it('should return 400 if the name is invalid', async () => {
    const response = await supertest(app.server).get('/user/jd')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: [
        {
          path: 'name',
          message: 'Name must have at least 4 characters',
        },
      ],
    })
  })

  it('should return 404 if the user is not found', async () => {
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null),
    }
    ;(getUsersCollection as jest.Mock).mockResolvedValue(mockCollection)

    const response = await supertest(app.server).get('/user/NotFoundUser')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'User with name "NotFoundUser" not found',
    })
  })
})
