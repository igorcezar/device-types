import knex from 'knex';

import baseConfig from '../../knexfile.js';

const db = knex(baseConfig);

export default db;
