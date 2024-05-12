import 'dotenv/config'
import { knex as knexSetup, Knex } from 'knex'
import { env } from './env'

console.log(env.DATABASE_URL)
export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export const knex = knexSetup(config)
