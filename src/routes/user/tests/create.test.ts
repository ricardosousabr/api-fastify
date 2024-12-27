import fastify from 'fastify'
import create from '../create'
import supertest from 'supertest'

describe('User Route', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    app = fastify()
    await app.register(create)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the name if it is valid', async () => {
    const response = await supertest(app.server).get('/user?name=John')

    expect(response.status).toBe(200)
    expect(response.text).toBe('John')
  })

  it('should return 400 if the name is too short', async () => {
    const response = await supertest(app.server).get('/user?name=Jo')

    expect(response.status).toBe(400)
  })

  it('should return 400 if the name is too long', async () => {
    const response = await supertest(app.server).get(
      '/user?name=ThisNameIsWayTooLong'
    )

    expect(response.status).toBe(400)
  })

  it('should return 400 if the name contains invalid characters', async () => {
    const response = await supertest(app.server).get('/user?name=John123')

    expect(response.status).toBe(400)
  })

  it('should return 400 if the name is missing', async () => {
    const response = await supertest(app.server).get('/user')

    expect(response.status).toBe(400)
  })
})
