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

  await db('user_devices')
    .insert({ deviceType, userKey })
    .onConflict('userKey') // Handle conflict on userKey as it's unique
    .merge() // Update all columns with new values on conflict
    .then(() => {
      res.status(200).send({ statusCode: 200 });
    })
    .catch((error: unknown) => {
      if (error instanceof Error) {
        console.error('Error inserting into user_devices:', error.message);
      } else {
        console.error('An unknown error occurred while inserting into user_devices:', error);
      }
      res.status(400).send({ statusCode: 400 });
    });
});

export default routes;
