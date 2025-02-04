import Fastify, { FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
import fastifyJwt from '@fastify/jwt' // Importação corrigida
import fCookie from '@fastify/cookie'
import { getUsersCollection } from './db'
import routes from './routes/index'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

dotenv.config()

const fastify: FastifyInstance = Fastify({
  logger: true,
})

// 🔹 Registra plugins necessários
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret', // Chave secreta do JWT
})
fastify.register(fCookie) // Registra cookies (se precisar no futuro)

// 🔹 Middleware de autenticação JWT
fastify.decorate('authenticate', async function (request, reply) {
  try {
    const decoded = await request.jwtVerify()
    request.user = decoded // Armazena o usuário decodificado na requisição
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})

// 🔹 Registrar rotas
fastify.register(routes)

// 🔹 Configurar validação com Zod
fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

// 🔹 Inicializar servidor
async function startServer() {
  try {
    await getUsersCollection() // Aguarda conexão com o banco
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    })
    fastify.log.info(
      `🚀 Servidor rodando em: http://localhost:${process.env.PORT || 3000}`
    )
  } catch (error) {
    fastify.log.error('Erro ao iniciar o servidor:', error)
    process.exit(1)
  }
}

startServer()
