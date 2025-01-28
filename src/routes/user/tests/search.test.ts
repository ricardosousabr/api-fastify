// import fastify from 'fastify'
// import supertest from 'supertest'
// import search from '../search' // Substitua pelo caminho correto
// import { getUsersCollection } from '../../../db'

// jest.setTimeout(30000) // Define timeout global para 30 segundos

// describe('User Router - GET /user/:name (sem mocks)', () => {
//   let app: ReturnType<typeof fastify>

//   beforeAll(async () => {
//     app = fastify()
//     await app.register(search) // Registra a rota
//     await app.ready()

//     // Insere dados de teste no banco
//     const usersCollection = await getUsersCollection()
//     await usersCollection.insertMany([
//       { name: 'JohnDoe' },
//       { name: 'JaneSmith' },
//     ])
//   })

//   afterAll(async () => {
//     // Limpa os dados de teste
//     const usersCollection = await getUsersCollection()
//     await usersCollection.deleteMany({}) // Remove todos os documentos

//     await app.close()
//   })

//   it('should return 200 and the user if the name is valid', async () => {
//     const response = await supertest(app.server).get('/user/JohnDoe')

//     expect(response.status).toBe(200) // Verifica o status 200
//     expect(response.body.message).toBe('User retrieved successfully') // Verifica a mensagem
//     expect(response.body.user).toMatchObject({
//       name: 'JohnDoe',
//     }) // Verifica o campo "name"
//     expect(response.body.user).toHaveProperty('_id') // Garante que o campo "_id" existe
//   })

//   it('should return 400 if the name is invalid', async () => {
//     const response = await supertest(app.server).get('/user/jd')

//     expect(response.status).toBe(400) // Verifica o status 400
//     expect(response.body).toEqual({
//       error: [
//         {
//           path: 'name',
//           message: 'Name must have at least 4 characters',
//         },
//       ],
//     }) // Verifica a mensagem de erro
//   })

//   it('should return 404 if the user is not found', async () => {
//     const response = await supertest(app.server).get('/user/NotFoundUser')

//     expect(response.status).toBe(404) // Verifica o status 404
//     expect(response.body).toEqual({
//       error: 'User with name "NotFoundUser" not found',
//     }) // Verifica a mensagem de erro
//   })
// })

import fastify from 'fastify'
import supertest from 'supertest'
import search from '../search' // Ajuste o caminho conforme necessário
import { getUsersCollection } from '../../../db'

// Mock da função getUsersCollection
jest.mock('../../../db', () => ({
  getUsersCollection: jest.fn(),
}))

describe('User Router - GET /user/:name (com mocks)', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    app = fastify()
    await app.register(search) // Registra a rota
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and the user if the name is valid', async () => {
    // Simula o retorno da função getUsersCollection
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
    // Simula o retorno vazio da função getUsersCollection
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
