import express from 'express';
import controllerModule from '../controllers';

const { boardModule } = controllerModule;

const boardRouter = express.Router();

boardRouter
  .get('/list', boardModule.list)
  .get('/info')
  .get('/favoriteinfo')
  .post('/create', boardModule.create)
  .post('/find_title')
  .put('/')
  .put('/like', boardModule.like)
  .put('/dislike')
  .delete('/');

export default boardRouter;
