import type { Knex } from 'knex';

import dotenv from 'dotenv';

// Load environment variables from .env file only in local/development environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../../.env' });
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME ?? 'devices',
    host: process.env.DB_HOST ?? 'localhost',
    password: process.env.DB_PASSWORD ?? 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER ?? 'postgres',
  },
  migrations: {
    directory: '../../migrations',
    tableName: 'knex_migrations',
  },
  pool: {
    max: 10,
    min: 0,
  },
};

export default config;
