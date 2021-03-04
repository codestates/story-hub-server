import { Router } from 'express';
import controllerModule from '../controllers';

const { commitModule } = controllerModule;
const commitRouter = Router();

commitRouter
  .get('/info')
  .get('/depth')
  .get('/alert_list')
  .get('/list')
  .post('/create', commitModule.create)
  .put('/', commitModule.commitUpdate)
  .put('/like')
  .put('/dislike')
  .put('/alert')
  .delete('/');

export default commitRouter;
