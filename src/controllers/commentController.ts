import { Request, Response } from 'express';
import commentModels from '../models/commentModels';
import { getUserInfo } from './common/function';

const commentModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, boardIndex, commitIndex, title, content } = req.body;

    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('존재하지 않는 사용자입니다.');
      }
      await commentModels.createComment({ email, boardIndex, commitIndex, title, content });
      return res.send('OK');
    } catch (err) {
      return err;
    }
  },

  list: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  alert_list: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  info: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  modify: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  like: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  dislike: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  alert: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },
};

export default commentModule;
