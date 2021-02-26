import { Router } from 'express';
import boardRouter from './boardRouter';
import userRouter from './userRouter';

const routes = Router();
routes.use('/user', userRouter);
routes.use('/board', boardRouter);

export default routes;
