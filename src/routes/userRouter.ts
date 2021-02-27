import { Router } from 'express';
import controllerModule from '../controllers';

const { oauthModule } = controllerModule;
const userRouter = Router();

userRouter
  .post('/login')
  .post('/kakao')
  .post('/google', oauthModule.google)
  .post('/signup')
  .post('/logout')
  .get('/info')
  .put('/')
  .delete('/');

export default userRouter;
