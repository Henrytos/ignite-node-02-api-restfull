import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
import { showRequest } from './middlewares/show-request'
export const app = fastify()

app.register(cookie)

app.addHook('preHandler', showRequest)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
