import { Router } from 'express';
import controllerModule from '../controllers';

const { commitModule } = controllerModule;
const commitRouter = Router();

commitRouter
  .get('/info', commitModule.myPageCommit)
  .get('/depth')
  .get('/alertlist', commitModule.commitAlertList)
  .get('/detail', commitModule.commitDetail)
  .get('/list', commitModule.commitList)
  .post('/create', commitModule.create)
  .put('/', commitModule.commitUpdate)
  .put('/merge', commitModule.commitMerge)
  .put('/like', commitModule.commitLike)
  .put('/dislike', commitModule.commitDisLike)
  .put('/alert')
  .delete('/', commitModule.commitDelete);

export default commitRouter;
