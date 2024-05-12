import { beforeAll, afterAll, it, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { describe } from 'node:test'
import { execSync } from 'node:child_process'

describe('testings route transactions', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a new transaction by the user', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 4000,
        type: 'credit',
      })
      .expect(201)
  })

  it('It should list the user is transactions', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Monthly salary',
        amount: 4000,
        type: 'credit',
      })

    const cookies = newTransactionResponse.headers['set-cookie']
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'Monthly salary', amount: 4000 }),
    ])
  })

  it('should the user can get a specific transaction', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })
    const cookies = newTransactionResponse.headers['set-cookie']

    const transactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const transactionId = transactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 4000,
      }),
    )
  })

  it('should summary transaction', async () => {
    const newTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction type credit',
        amount: 4000,
        type: 'credit',
      })
    const cookies = newTransactionResponse.headers['set-cookie']
    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Transaction type debit',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
    expect(summaryResponse.body).toEqual({
      summary: {
        amount: 2000,
      },
    })
  })
})
