import fastify from 'fastify'
import deleteUser from '../delete'
import supertest from 'supertest'

describe('User Route', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    app = fastify()
    await app.register(deleteUser)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 if the name is too short', async () => {
    const user = {
      name: 'jay',
    }

    const response = await supertest(app.server)
      .delete('/user/:name')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should return 400 if the name is too long', async () => {
    const user = {
      name: 'Verylongusername',
    }

    const response = await supertest(app.server)
      .delete('/user/:name')
      .send(user)

    expect(response.status).toBe(400)
  })
})
