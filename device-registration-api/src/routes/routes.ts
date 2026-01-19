import { Router } from 'express';

import db from '../persistence/db.js';

const routes: Router = Router();

interface Auth {
  deviceType: string;
  userKey: string;
}

routes.get('/', (req, res) => {
  res.send('API operational!');
});

routes.get('/health', (req, res) => {
  res.status(200).send('OK');
});

routes.post('/Device/register', async (req: { body: Auth }, res): Promise<void> => {
  const { deviceType, userKey } = req.body;
  console.log('Received data:', { deviceType, userKey });

  await db
    .insert({ deviceType, userKey })
    .into('user_devices')
    .then(() => {
      res.status(200).send({ statusCode: 200 });
    })
    .catch((error) => {
      console.error('Error inserting into user_devices:', error.message);
      res.status(400).send({ statusCode: 400 });
    });
});

export default routes;
