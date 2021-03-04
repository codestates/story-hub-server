import { Router } from 'express';
import controllerModule from '../controllers';

const { commitModule } = controllerModule;
const commitRouter = Router();

commitRouter
  .get('/info', commitModule.myPageCommit)
  .get('/depth')
  .get('/alert_list')
  .get('/list')
  .post('/create', commitModule.create)
  .put('/')
  .put('/like')
  .put('/dislike')
  .put('/alert')
  .delete('/');

export default commitRouter;
