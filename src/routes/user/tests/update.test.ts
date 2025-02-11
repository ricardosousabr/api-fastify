import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import supertest from 'supertest'
import * as db from '../../../db'

jest.mock('../../../db', () => ({
  getUsersCollection: jest.fn(),
}))

describe('User Router - PUT /user (sem autenticação nos testes)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = fastify()

    await app.register(
      (instance: FastifyInstance, _: any, done: () => void) => {
        instance.route({
          method: 'PUT',
          url: '/user',
          handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const body =
              (request.body as { name?: string; password?: string }) || {}
            if (!body.name || body.name.length < 4) {
              return reply.code(400).send({
                error: [
                  {
                    path: 'name',
                    message: 'Name must have at least 4 characters',
                  },
                ],
              })
            }
            if (!body.password || body.password.length < 8) {
              return reply.code(400).send({
                error: [
                  {
                    path: 'password',
                    message: 'Password must have at least 8 characters',
                  },
                ],
              })
            }
            const { name, password } = body

            const usersCollection = await db.getUsersCollection()
            const updateResult = await usersCollection.updateOne(
              { name },
              { $set: { password } }
            )

            if (updateResult.matchedCount === 0) {
              return reply
                .code(404)
                .send({ error: `No user found with the name "${name}"` })
            }

            return reply.code(200).send({
              message: `User "${name}" updated successfully`,
              updatedFields: { name, password },
            })
          },
        })
        done()
      }
    )

    await app.ready()

    jest.spyOn(db, 'getUsersCollection').mockResolvedValue({
      updateOne: jest.fn((filter) => {
        if (filter.name === 'JohnDoe') {
          return { matchedCount: 1, modifiedCount: 1 }
        } else {
          return { matchedCount: 0 }
        }
      }),
    } as any)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
    await app.close()
  })

  it('should return 200 if the user is successfully updated', async () => {
    const response = await supertest(app.server).put('/user').send({
      name: 'JohnDoe',
      password: 'newStrongPass',
    })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User "JohnDoe" updated successfully')
    expect(response.body.updatedFields).toEqual({
      name: 'JohnDoe',
      password: 'newStrongPass',
    })
  })

  it('should return 404 if the user does not exist', async () => {
    const response = await supertest(app.server).put('/user').send({
      name: 'NonExistentUser',
      password: 'newStrongPass',
    })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(
      'No user found with the name "NonExistentUser"'
    )
  })
})
