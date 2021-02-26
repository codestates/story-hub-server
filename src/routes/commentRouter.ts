import { Router } from 'express';

const commentRouter = Router();

commentRouter
  .get('/list')
  .get('/alert_list')
  .get('/info')
  .post('/create')
  .put('/')
  .put('/like')
  .put('/dislike')
  .put('/alert')
  .delete('/');

export default commentRouter;
