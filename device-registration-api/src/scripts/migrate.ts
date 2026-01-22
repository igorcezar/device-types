import db from '../persistence/db.js';

export async function runMigrations() {
  console.info('Running migrations...');

  const [batchNo, log] = (await db.migrate.latest()) as [number, string[]];

  if (log.length === 0) {
    console.info('Database is up to date');
  } else {
    console.info(`Batch ${batchNo} ran ${log.length} migration(s):`);
    log.forEach((migration: string) => {
      console.info(`  - ${migration}`);
    });
  }
}

export async function runRollback() {
  console.info('Rolling back migrations...');

  const [batchNo, log] = (await db.migrate.rollback()) as [number, string[]];

  if (log.length === 0) {
    console.info('No migrations to rollback');
  } else {
    console.info(`Batch ${batchNo} rolled back ${log.length} migration(s):`);
    log.forEach((migration: string) => {
      console.info(`  - ${migration}`);
    });
  }
}

// Run as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.info('Migrations completed successfully');
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('Migration failed:', error);
      process.exit(1);
    })
    .finally(() => {
      void db.destroy();
    });
}
