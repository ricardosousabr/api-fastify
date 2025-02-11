import { FastifyPluginCallback } from 'fastify'

const authPlugin: FastifyPluginCallback = (fastify, options, done) => {
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
      request.user = request.user
    } catch {
      reply.code(401).send({ error: 'Unauthorized' })
    }
  })
  done()
}

export default authPlugin
