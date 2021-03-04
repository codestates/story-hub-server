import { Router } from 'express';
import controllerModule from '../controllers';

const { commitModule } = controllerModule;
const commitRouter = Router();

commitRouter
  .get('/info', commitModule.myPageCommit)
  .get('/depth')
  .get('/alertlist', commitModule.commitAlertList)
  .get('/list')
  .get('/detail', commitModule.commitDetail)
  .post('/create', commitModule.create)
  .put('/', commitModule.commitUpdate)
  .put('/like', commitModule.commitLike)
  .put('/dislike', commitModule.commitDisLike)
  .put('/alert')
  .delete('/', commitModule.commitDelete);

export default commitRouter;
