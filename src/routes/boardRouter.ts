import express from 'express';
import controllerModule from '../controllers';

const { boardModule } = controllerModule;

const boardRouter = express.Router();

boardRouter
  .get('/list', boardModule.list)
  .get('/info', boardModule.info)
  .get('/favoriteinfo', boardModule.favorite)
  .post('/create', boardModule.create)
  .post('/find_title', boardModule.findTitle)
  .put('/', boardModule.update)
  .put('/like', boardModule.like)
  .put('/dislike', boardModule.disLike)
  .delete('/', boardModule.delete);

export default boardRouter;
