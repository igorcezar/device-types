import db from './persistence/db.js';
import { runMigrations } from './scripts/migrate.js';
import { createServer } from './server.js';

async function start() {
  try {
    // Run migrations
    await runMigrations();

    // Start server
    const port = process.env.PORT ?? 3000;
    const server = createServer();

    server.listen(port, () => {
      console.info(`Server listening on http://localhost:${port}`);
    });
  } catch (error: unknown) {
    console.error('Failed to start application:', error);
    await db.destroy();
    process.exit(1);
  }
}

await start();
