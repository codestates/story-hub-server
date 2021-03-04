import { Router } from 'express';
import controllerModule from '../controllers';

const { commitModule } = controllerModule;
const commitRouter = Router();

commitRouter
  .get('/info', commitModule.myPageCommit)
  .get('/depth')
  .get('/alertlist', commitModule.commitAlertList)
  .get('/list')
  .post('/create', commitModule.create)
  .put('/', commitModule.commitUpdate)
  .put('/like')
  .put('/dislike')
  .put('/alert')
  .delete('/', commitModule.commitDelete);

export default commitRouter;
