import { createServer } from './server.js';

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.info(`Listening on http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
