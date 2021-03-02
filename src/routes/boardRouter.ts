import express from 'express';
import controllerModule from '../controllers';

const { boardModule } = controllerModule;

const boardRouter = express.Router();

boardRouter
  .get('/list')
  .get('/info')
  .get('/favoriteinfo')
  .post('/create', boardModule.create)
  .post('/find_title')
  .put('/')
  .put('/like')
  .put('/dislike')
  .delete('/');

export default boardRouter;
