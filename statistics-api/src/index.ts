import { createServer } from './server.js';

const port = process.env.PORT ?? 3000;
const server = createServer();

server.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
