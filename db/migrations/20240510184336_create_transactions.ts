import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid()) // 370128y-3_1287hg-30712g
    table.text('title').notNullable() // comida
    table.decimal('amount', 10, 2).notNullable() // 20.00
    table.date('created_at').defaultTo(knex.fn.now()) // 2022-05-10
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
