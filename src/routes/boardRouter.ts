import express from 'express';
import controllerModule from '../controllers';

const { boardModule } = controllerModule;

const boardRouter = express.Router();

boardRouter
  .get('/list', boardModule.list)
  .get('/info')
  .get('/favoriteinfo')
  .post('/create', boardModule.create)
  .post('/find_title', boardModule.findTitle)
  .put('/', boardModule.update)
  .put('/like', boardModule.like)
  .put('/dislike', boardModule.disLike)
  .delete('/', boardModule.delete);

export default boardRouter;
