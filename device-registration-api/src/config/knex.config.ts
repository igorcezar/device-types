import type { Knex } from 'knex';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    directory: path.resolve(__dirname, '../../migrations'),
    tableName: 'knex_migrations',
  },
  pool: {
    max: 10,
    min: 0,
  },
};

export default config;
