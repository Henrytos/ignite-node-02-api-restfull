import { FastifyRequest } from 'fastify'

export async function showRequest(request: FastifyRequest) {
  console.log(`[${request.method}] ${request.url}`)
}
