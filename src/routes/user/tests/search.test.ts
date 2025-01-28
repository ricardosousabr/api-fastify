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

jest.setTimeout(60000) // Timeout global de 60 segundos para ambientes mais lentos

describe('User Router - GET /user/:name (sem mocks)', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    console.log('Iniciando Fastify...')
    app = fastify()

    console.log('Registrando rotas...')
    await app.register(search)

    console.log('Preparando a aplicação...')
    await app.ready()

    console.log('Inserindo dados de teste no banco...')
    const usersCollection = await getUsersCollection()
    await usersCollection.insertMany([
      { name: 'JohnDoe' },
      { name: 'JaneSmith' },
    ])
    console.log('Dados de teste inseridos.')
  })

  afterAll(async () => {
    console.log('Limpando dados de teste...')
    const usersCollection = await getUsersCollection()
    await usersCollection.deleteMany({}) // Remove todos os documentos

    console.log('Fechando a aplicação...')
    await app.close()
    console.log('Aplicação fechada.')
  })

  it('should return 200 and the user if the name is valid', async () => {
    console.log('Testando busca de usuário válido...')
    const response = await supertest(app.server).get('/user/JohnDoe')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User retrieved successfully')
    expect(response.body.user).toMatchObject({ name: 'JohnDoe' })
    expect(response.body.user).toHaveProperty('_id')
    console.log('Teste concluído com sucesso para usuário válido.')
  })

  it('should return 400 if the name is invalid', async () => {
    console.log('Testando busca com nome inválido...')
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
    console.log('Teste concluído com sucesso para nome inválido.')
  })

  it('should return 404 if the user is not found', async () => {
    console.log('Testando busca de usuário inexistente...')
    const response = await supertest(app.server).get('/user/NotFoundUser')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'User with name "NotFoundUser" not found',
    })
    console.log('Teste concluído com sucesso para usuário inexistente.')
  })
})
