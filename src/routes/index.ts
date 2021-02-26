import { Router } from 'express';
import boardRouter from './boardRouter';
import userRouter from './userRouter';
import commentRouter from './commentRouter';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/board', boardRouter);
routes.use('/comment', commentRouter);

export default routes;
