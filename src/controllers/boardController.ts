import { Request, Response } from 'express';
import boardModels from '../models/boardModels';
import verifyModule from '../token/verifyToken';

const { verifyUser } = verifyModule;

const boardModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);
      const getEmail = await verifyUser(loginType, token);
      req.body.email = getEmail.email;

      const result = await boardModels.createBoard(req.body);
      if (result === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return err;
    }
  },
  list: async (req: Request, res: Response): Promise<Response> => {
    try {
      const boardList = await boardModels.list();
      const { hotStory, newStory } = boardList;
      return res.send({ hotStory: hotStory[0], newStory: newStory[0] });
    } catch (err) {
      return err;
    }
  },
  like: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);
      const getEmail = await verifyUser(loginType, token);

      req.body.email = getEmail.email;

      const result = await boardModels.like(req.body);
      if (result === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return err;
    }
  },
  disLike: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getEmail = await verifyUser(loginType, token);

      req.body.email = getEmail.email;

      const result = await boardModels.disLike(req.body);
      if (result === 'OK') {
        res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return err;
    }
  },
};
export default boardModule;
