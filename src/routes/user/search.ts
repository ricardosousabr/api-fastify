import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export default async (app: FastifyInstance) => {
  const opts = {
    schema: {
      params: z.object({
        name: z.string().min(4),
      }),
      response: {
        200: z.string(),
      },
    },
  }
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/user/:name', opts, (req, res) => {
      res.send(req.params.name)
    })
}
