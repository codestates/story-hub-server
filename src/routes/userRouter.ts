import { Router } from 'express';
import controllerModule from '../controllers';

const { oauthModule, userModule } = controllerModule;
const userRouter = Router();

userRouter
  .post('/login', userModule.login)
  .post('/kakao', oauthModule.kakao)
  .post('/google', oauthModule.google)
  .post('/signup', userModule.signup)
  .post('/logout', userModule.logout)
  .get('/info', userModule.info)
  .put('/', userModule.modify)
  .put('/withdraw', userModule.withdraw)
  .delete('/', userModule.delete);

export default userRouter;
