import express from 'express';

const boardRouter = express.Router();

boardRouter
  .get('/list')
  .get('/info')
  .get('/favoriteinfo')
  .post('/create')
  .post('/find_title')
  .put('/')
  .put('/like')
  .put('/dislike')
  .delete('/');

export default boardRouter;
