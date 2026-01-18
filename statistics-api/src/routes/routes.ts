import { Router } from 'express';

const routes = Router();

routes.post('/Log/auth', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = req.body;
  console.log('Received data:', data);

  res.status(201).send('Data received and processed successfully');
});

export default routes;
