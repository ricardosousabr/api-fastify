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

  it('should return 400 if the name is too short', async () => {
    const user = {
      name: 'jay',
      password: '12345678',
    }
    const response = await supertest(app.server).post('/user').send(user)

    expect(response.status).toBe(400)
  })

  it('should return 400 if the password is too short', async () => {
    const user = {
      name: 'Ricardo',
      password: '123',
    }
    const response = await supertest(app.server).post('/user').send(user)

    expect(response.status).toBe(400)
  })

  it('should return 400 if the name is too long', async () => {
    const user = {
      name: 'Verylongusername',
      password: '12345678',
    }

    const response = await supertest(app.server).post('/user').send(user)

    expect(response.status).toBe(400)
  })

  it('should return 400 if the password is too long', async () => {
    const user = {
      name: 'Ricardo',
      password: 'Verylonguserpassword',
    }

    const response = await supertest(app.server).post('/user').send(user)

    expect(response.status).toBe(400)
  })

  // it('should return 200 if the name and password contains valid characters', async () => {
  //   const user = {
  //     name: 'Ricardo',
  //     password: '12345678',
  //   }
  //   const response = await supertest(app.server).post('/user').send(user)

  //   expect(response.status).toBe(200)
  // })

  it('should return 400 if name and password are missing', async () => {
    const response = await supertest(app.server).post('/user')

    expect(response.status).toBe(400)
  })
})
