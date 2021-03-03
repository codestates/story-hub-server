import { Request, Response } from 'express';
import commentModels from '../models/commentModels';
import { getUserInfo } from './common/function';

const commentModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, boardIndex, commitIndex, content } = req.body;

    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commentModels.createComment({ email, boardIndex, commitIndex, content });
      return res.send('OK');
    } catch (err) {
      return err;
    }
  },

  list: async (req: Request, res: Response): Promise<Response> => {
    try {
      // TODO : 한가지 게시물에 대한 댓글 리스트를 보여준다.
      const { boardIndex, commitIndex } = req.body;
      const commentList = await commentModels.getCommentList({ boardIndex, commitIndex });

      return res.json({
        commentList,
      });
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
    const { authorization } = req.headers;
    const { loginType, commentIndex } = req.body;
    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      // eslint-disable-next-line no-unused-vars
      const response = await commentModels.likeComment({ email, commentIndex });
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
