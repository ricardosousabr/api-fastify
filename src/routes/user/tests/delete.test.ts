import fastify from 'fastify'
import supertest from 'supertest'
import userRoutes from '../delete' // Substitua pelo caminho correto
import * as db from '../../../db'

describe('User Router - DELETE /user/:name', () => {
  let app: ReturnType<typeof fastify>
  const mockDatabase = [{ name: 'JohnDoe' }, { name: 'JaneSmith' }]

  beforeAll(async () => {
    app = fastify()
    await app.register(userRoutes)
    await app.ready()

    // Mock da função getUsersCollection
    jest.spyOn(db, 'getUsersCollection').mockResolvedValue({
      deleteMany: jest.fn((filter) => {
        const initialLength = mockDatabase.length
        const filteredUsers = mockDatabase.filter(
          (user) => user.name !== filter.name
        )
        const deletedCount = initialLength - filteredUsers.length
        mockDatabase.splice(0, mockDatabase.length, ...filteredUsers)
        return { deletedCount }
      }),
      insertMany: jest.fn((users) => {
        mockDatabase.push(...users)
      }),
      findOne: jest.fn(({ name }) => {
        return mockDatabase.find((user) => user.name === name) || null
      }),
    } as any)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
    await app.close()
  })

  it('should return 200 if the user is successfully deleted', async () => {
    const response = await supertest(app.server).delete('/user/JohnDoe')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: '1 user(s) deleted successfully',
    })
  })

  it('should return 404 if the user does not exist', async () => {
    const response = await supertest(app.server).delete('/user/NonExistentUser')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'No users found with the name "NonExistentUser"',
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
