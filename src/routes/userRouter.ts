import { Router } from 'express';
import controllerModule from '../controllers';

const { oauthModule } = controllerModule;

const userRouter = Router();

userRouter
  .post('/login')
  .post('/kakao', oauthModule.kakao)
  .post('/google')
  .post('/signup')
  .post('/logout')
  .get('/info')
  .put('/')
  .delete('/');

export default userRouter;
