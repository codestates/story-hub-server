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

      boardModels.createBoard(req.body);
      // email을 clinet에서 받은 정보들과 함께 model로 보내준다.

      const result = await boardModels.createBoard(req.body);
      if (result === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return err;
    }
  },
};

export default boardModule;
