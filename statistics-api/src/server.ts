import type { Express } from 'express-serve-static-core';

import express from 'express';

import routes from './routes/routes.js';

export function createServer(): Express {
  const server = express();

  // Parse JSON request bodies
  server.use(express.json());

  // Set default routes
  server.use(routes);

  return server;
}
