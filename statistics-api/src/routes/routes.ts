import type { AxiosInstance } from 'axios';

import axios from 'axios';
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

routes.post('/Log/auth', async (req: { body: Auth }, res) => {
  const { deviceType, userKey } = req.body;
  console.log('Received data:', { deviceType, userKey });
  console.info('Environment Variable DEVICE_REGISTRATION_API:', process.env.DEVICE_REGISTRATION_API);

  const deviceRegistrationApi: AxiosInstance = axios.create({
    baseURL: process.env.DEVICE_REGISTRATION_API ?? 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await deviceRegistrationApi
    .post('/Device/register', { deviceType, userKey })
    .then((response) => {
      console.log('Response from DEVICE_REGISTRATION_API:', response.data);
      res.status(response.status).send({
        message: 'success',
        statusCode: response.status,
      });
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error communicating with DEVICE_REGISTRATION_API:', errorMessage);
      res.status(400).send({
        message: 'bad_request',
        statusCode: 400,
      });
    });
});

routes.get('/Log/auth/statistics', async (req, res) => {
  const { deviceType } = req.query;

  await db
    .count('*')
    .from('user_devices')
    .where({ deviceType })
    .then((result) => {
      const count = Number(result[0]?.count) || 0;

      if (count === 0) {
        res.status(400).send({ count: -1, deviceType });
        return;
      }

      res.status(200).send({ count, deviceType });
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching statistics from user_devices:', errorMessage);

      res.status(500).send({ deviceType, error: 'Internal server error' });
    });
});

export default routes;
