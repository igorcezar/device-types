import { Router } from 'express';

const routes = Router();

routes.post('/Log/auth', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);

  res.status(201).send('Data received and processed successfully');
});

export default routes;