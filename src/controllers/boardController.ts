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
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);
      const getEmail = await verifyUser(loginType, token);

      req.body.email = getEmail.email;

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
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getEmail = await verifyUser(loginType, token);

      req.body.email = getEmail.email;

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
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getMail = await verifyUser(loginType, token);
      req.body.email = getMail.email;

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
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getEmail = await verifyUser(loginType, token);
      req.body.email = getEmail.email;

      const result = await boardModels.boardUpdate(req.body);

      return result === 'OK' ? res.send({ message: 'OK' }) : res.send({ message: 'Fail' });
    } catch (err) {
      return res.send(err);
    }
  },
  info: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getEmail = await verifyUser(loginType, token);
      req.body.email = getEmail.email;

      const boardInfo = await boardModels.myPageInfo(req.body);

      return res.send({ boardInfo });
    } catch (err) {
      return res.send(err);
    }
  },
  favorite: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { loginType } = req.body;
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);

      const getEmail = await verifyUser(loginType, token);
      req.body.email = getEmail.email;

      const favoriteInfo = await boardModels.myFavoriteList(req.body);

      return res.send({ favoriteInfo });
    } catch (err) {
      return res.send(err);
    }
  },
};
export default boardModule;
