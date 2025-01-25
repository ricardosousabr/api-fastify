import fastify from 'fastify'
import supertest from 'supertest'
import userRoutes from '../delete' // Substitua pelo caminho correto
import { getUsersCollection } from '../../../db'

describe('User Router - DELETE /user/:name', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    app = fastify()
    await app.register(userRoutes) // Registra a rota
    await app.ready()

    const usersCollection = await getUsersCollection()
    await usersCollection.insertMany([
      { name: 'JohnDoe' },
      { name: 'JaneSmith' },
    ])
  })

  afterAll(async () => {
    const usersCollection = await getUsersCollection()
    await usersCollection.deleteMany({})
    await app.close()
  })

  it('should return 200 if the user is successfully deleted', async () => {
    const response = await supertest(app.server).delete('/user/JohnDoe')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: '1 user(s) deleted successfully', // Ajustado para refletir a resposta atual
    })
  })

  it('should return 404 if the user does not exist', async () => {
    const response = await supertest(app.server).delete('/user/NonExistentUser')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'No users found with the name "NonExistentUser"', // Ajustado para refletir a resposta atual
    })
  })

  it('should return 400 if the name is invalid', async () => {
    const response = await supertest(app.server).delete('/user/abc')

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
})
