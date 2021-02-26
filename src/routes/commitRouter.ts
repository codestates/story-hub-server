import { Router } from 'express';

const commitRouter = Router();

commitRouter
  .get('/info')
  .get('/depth')
  .get('/alert_list')
  .get('/list')
  .post('/create')
  .put('/')
  .put('/like')
  .put('/dislike')
  .put('/alert')
  .delete('/');

export default commitRouter;
