import db from '../persistence/db.js';
import { runRollback } from './migrate.js';

runRollback()
  .then(() => {
    console.info('Rollback completed successfully');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('Rollback failed:', error);
    process.exit(1);
  })
  .finally(() => {
    void db.destroy();
  });
