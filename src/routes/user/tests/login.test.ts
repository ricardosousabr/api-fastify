import fastify, { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import loginRoute from '../login' // Ajuste o caminho conforme necessário
import { getUsersCollection } from '../../../db'
import bcrypt from 'bcrypt'

jest.mock('../../../db', () => ({
  getUsersCollection: jest.fn(),
}))

describe('User Router - POST /login', () => {
  let app: FastifyInstance
  const mockUser = { _id: '1', name: 'JohnDoe', password: 'hashedPassword' }

  beforeAll(async () => {
    app = fastify()
    app.register(require('@fastify/jwt'), { secret: 'testSecret' })

    await app.register(loginRoute)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 if credentials are invalid', async () => {
    ;(getUsersCollection as jest.Mock).mockResolvedValue({
      findOne: jest.fn().mockResolvedValue(null),
    })

    const response = await supertest(app.server).post('/login').send({
      name: 'NonExistentUser',
      password: 'password123',
    })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Invalid credentials')
  })
})
