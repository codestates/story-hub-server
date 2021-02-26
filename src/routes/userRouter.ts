import { Router } from 'express';

const userRouter = Router();

userRouter
  .post('/login')
  .post('/kakao')
  .post('/google')
  .post('/signup')
  .post('/logout')
  .get('/info')
  .put('/')
  .delete('/');

export default userRouter;
