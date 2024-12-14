import Fastify from 'fastify'
import search from './search'
import supertest from 'supertest'

describe('User Route', () => {
  let app: ReturnType<typeof Fastify>

  beforeAll(async () => {
    app = Fastify()
    await app.register(search) // Registra a rota no servidor
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the name if it is valid', async () => {
    const response = await supertest(app.server).get('/user/JohnDoe')

    expect(response.status).toBe(200)
    expect(response.text).toBe('JohnDoe')
  })

  it('should return 400 if the name is too short', async () => {
    const response = await supertest(app.server).get('/user/Jo')

    expect(response.status).toBe(400)
  })
})
