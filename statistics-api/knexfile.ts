import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const baseConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME ?? 'device',
    host: process.env.DB_HOST ?? 'localhost',
    password: process.env.DB_PASSWORD ?? 'password',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER ?? 'postgres',
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  pool: {
    max: 10,
    min: 0,
  },
};

export default baseConfig;
