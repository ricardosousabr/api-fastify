import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Defina os esquemas Zod
const paramsSchema = z.object({
  name: z.string().min(4, 'Name must have at least 4 characters'),
})

const responseSchema = z.string()

// Converta Zod para JSON Schema
const paramsJsonSchema = zodToJsonSchema(paramsSchema)
const responseJsonSchema = zodToJsonSchema(responseSchema)

export default async (app: FastifyInstance) => {
  // Define o tipo do provider
  app
    .withTypeProvider()
    .get<{ Params: z.infer<typeof paramsSchema> }>('/user/:name', {
      schema: {
        params: paramsJsonSchema,
        response: {
          200: responseJsonSchema,
        },
      },
      handler: (req, res) => {
        // O TypeScript agora sabe que req.params é do tipo correto
        const { name } = req.params
        res.send(name)
      },
    })
}
