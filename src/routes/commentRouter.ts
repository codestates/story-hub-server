import { Router } from 'express';
import controllerModule from '../controllers';

const { commentModule } = controllerModule;
const commentRouter = Router();

commentRouter
  .get('/list', commentModule.list)
  .get('/alert_list', commentModule.alert_list)
  .get('/info', commentModule.info)
  .post('/create', commentModule.create)
  .put('/', commentModule.modify)
  .put('/like', commentModule.like)
  .put('/dislike', commentModule.dislike)
  .put('/alert', commentModule.alert)
  .delete('/', commentModule.delete);

export default commentRouter;
