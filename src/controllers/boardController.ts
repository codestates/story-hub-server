import { Request, Response } from 'express';
import boardModels from '../models/boardModels';
import tokenModule from '../token';

const { verifyAccessToken } = tokenModule;
const boardModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;
      const result = await boardModels.createBoard(req.body);
      if (result === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  list: async (req: Request, res: Response): Promise<Response> => {
    try {
      const boardList = await boardModels.hotAndNewList();
      const { hotStory, newStory } = boardList;
      return res.send({ hotStory: hotStory[0], newStory: newStory[0] });
    } catch (err) {
      return res.send(err);
    }
  },
  like: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;

      const result = await boardModels.boardLike(req.body);
      if (result === 'OK') {
        return res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  disLike: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;

      const result = await boardModels.boardDisLike(req.body);
      if (result === 'OK') {
        res.send({ message: 'OK' });
      }
      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  findTitle: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title } = req.body;
      const list = await boardModels.searchTitle(title);
      return res.send({ list });
    } catch (err) {
      return res.send(err);
    }
  },
  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.query;
      const { boardIndex } = req.query;
      const { authorization } = req.headers;
      const { email } = await getUserInfo(String(authorization?.split(' ')[1]), Number(loginType));
      req.body.email = email;
      req.body.boardIndex = boardIndex;

      const result = await boardModels.boardDelete(req.body);

      if (result === 'OK') {
        return res.send('hi');
      }

      return res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  update: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;

      const result = await boardModels.boardUpdate(req.body);

      return result === 'OK' ? res.send({ message: 'OK' }) : res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  info: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;

      const boardInfo = await boardModels.myPageInfo(req.body);

      return res.send(boardInfo);
    } catch (err) {
      return res.send(err);
    }
  },
  favorite: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const { email } = await verifyAccessToken(String(authorization?.split(' ')[1]));
      req.body.email = email;

      const favoriteInfo = await boardModels.myFavoriteList(req.body);

      return res.send(favoriteInfo);
    } catch (err) {
      return res.send(err);
    }
  },
  mypageDetail: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { boardIndex } = req.query;
      req.body.boardIndex = boardIndex;
      const mypageDetailInfo = await boardModels.mypageDetailList(req.body);

      return res.send(mypageDetailInfo);
    } catch (err) {
      return res.send(err);
    }
  },
  storyDetailInfo: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { boardIndex } = req.query;
      if (boardIndex === undefined) {
        return res.json('해당 값이 없습니다');
      }

      const storyDetailInfo = await boardModels.storyDetailList(String(boardIndex));

      return res.send(storyDetailInfo);
    } catch (err) {
      return res.send(err);
    }
  },
  storyDetailContent: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { boardIndex } = req.query;

      const response = await boardModels.storyDetailContent(String(boardIndex));
      return res.send({ boardInfo: response[0], commitInfo: response[1] });
    } catch (err) {
      return err;
    }
  },
};
export default boardModule;
