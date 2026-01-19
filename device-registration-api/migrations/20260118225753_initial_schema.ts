import type { Knex } from 'knex';

const tableName = 'user_devices';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('userKey').unique().notNullable();
    table.string('deviceType').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
