import { Request, Response } from 'express';
import commitModels from '../models/commitModels';
import { getUserInfo } from './common/function';

const commitModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      req.body.email = email;

      const commitCreate = await commitModels.create(req.body);
      if (commitCreate === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  commitList: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { boardIndex } = req.body;
      const list = await commitModels.commitList(boardIndex);
      return res.json(list);
    } catch (err) {
      return res.send(err);
    }
  },
  commitUpdate: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, title, content, commitIndex } = req.body;
    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commitModels.commitUpdate({ email, title, content, commitIndex });
      return res.send('OK');
    } catch (err) {
      return res.send(err);
    }
  },
  commitDelete: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, commitIndex } = req.body;
    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commitModels.commitDelete({ email, commitIndex });
      return res.send('OK');
    } catch (err) {
      return res.send(err);
    }
  },
  commitLike: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, commitIndex } = req.body;
    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commitModels.commitLike({ email, commitIndex });
      return res.json({ message: 'like' });
    } catch (err) {
      return res.send(err);
    }
  },
  commitDisLike: async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;
    const { loginType, commitIndex } = req.body;
    try {
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commitModels.dislikeComment({ email, commitIndex });
      return res.json({ message: 'dislike' });
    } catch (err) {
      return err;
    }
  },
  myPageCommit: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      req.body.email = email;

      const commitList = await commitModels.myPageCommit(req.body);
      return res.send({ commitList });
    } catch (err) {
      return res.send(err);
    }
  },
  commitDepth: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitAlertList: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      req.body.email = email;

      const alertList = await commitModels.commitAlertList(req.body);
      return res.send({ alertList });
    } catch (err) {
      return res.send(err);
    }
  },
  commitUpdateAlert: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { loginType, commitIndex } = req.body;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      if (email === undefined) {
        return res.send('검증되지 않은 유저입니다.');
      }
      await commitModels.commitUpdateAlert({ email, commitIndex });
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitMerge: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      req.body.email = email;

      const result = await commitModels.commitMergeCheck(req.body);
      if (result) {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  commitDetail: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), loginType);
      req.body.email = email;

      const detailInfo = await commitModels.commitDetail(req.body);

      return res.send({ detailInfo });
    } catch (err) {
      return res.send(err);
    }
  },
};

export default commitModule;
