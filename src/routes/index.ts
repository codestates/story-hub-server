import { Router } from 'express';
import boardRouter from './boardRouter';
import commitRouter from './commitRouter';
import userRouter from './userRouter';

const routes = Router();
routes.use('/user', userRouter);
routes.use('/board', boardRouter);
routes.use('/commit', commitRouter);

export default routes;
