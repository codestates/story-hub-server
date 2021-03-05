import { Request, Response } from 'express';
import crypto from 'crypto';
import userModels from '../models/userModels';
import { getUserInfo } from './common/function';

const userModule = {
  login: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
      const hasPw = await crypto.pbkdf2Sync(
        password,
        String(process.env.CRYPTO_SALT),
        Number(process.env.CRYPTO_ITERATOR),
        32,
        String(process.env.CRYPTO_ALGORITH)
      );
      const idCheck = await userModels.findUser({ email });
      if (idCheck.onCheck) {
        res.status(409).send('존재하지 않는 유저입니다.');
      }

      const login = await userModels.loginUser({ email, password: hasPw.toString('hex') });
      if (login.onCheck) {
        return res.status(409).send('비밀번호가 틀렸거나, 탈퇴한 유저입니다.');
      }
      const { accessToken } = login;
      return res.json({
        accessToken,
      });
    } catch (err) {
      return err;
    }
  },

  signup: async (req: Request, res: Response): Promise<Response> => {
    const { email, password, userName, nickname } = req.body;
    const hasPw = await crypto.pbkdf2Sync(
      password,
      String(process.env.CRYPTO_SALT),
      Number(process.env.CRYPTO_ITERATOR),
      32,
      String(process.env.CRYPTO_ALGORITH)
    );
    try {
      const idCheck = await userModels.findUser({ email });
      if (idCheck.onCheck) {
        await userModels.createUser({
          email,
          password: hasPw.toString('hex'),
          userName,
          nickname,
        });
        return res.status(201).send('회원가입 성공');
      }
      return res.status(409).send('회원가입 실패');
    } catch (err) {
      return err;
    }
  },

  // TODO: react-google-login 안에 login, logout 둘다 존재함
  logout: async (req: Request, res: Response): Promise<Response> => {
    try {
      res.clearCookie('accessToken');
      return res.send('로그아웃');
    } catch (err) {
      return err;
    }
  },

  info: async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = String(req.headers.authorization?.split(' ')[1]);
      const { loginType } = req.body;
      const { email, nickname, userName } = await getUserInfo(token, loginType);

      return res.json({
        data: {
          email,
          nickname,
          userName,
        },
      });
    } catch (err) {
      return res.send(err);
    }
  },

  modify: async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = String(req.headers.authorization?.split(' ')[1]);
      const { loginType, nickname } = req.body;
      const { email, userName } = await getUserInfo(token, loginType);
      const newToken = await userModels.updateUser({ email, nickname, userName });
      return res.json({
        accessToken: newToken,
      });
    } catch (err) {
      return err;
    }
  },

  withdraw: async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = String(req.headers.authorization?.split(' ')[1]);
      const { loginType } = req.body;
      const { email } = await getUserInfo(token, loginType);
      await userModels.withdrawUser({ email });
      return res.send('OK');
    } catch (err) {
      return err;
    }
  },
  // TODO: 관리자 페이지에서 삭제요청을 보낼수 있는게 맞을듯
  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },
};

export default userModule;
