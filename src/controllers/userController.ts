import { Request, Response } from 'express';
import crypto from 'crypto';
import userModels from '../models/userModels';
import tokenModule from '../token';

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
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  signup: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },

  logout: async (req: Request, res: Response): Promise<Response> => {
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

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('test');
    } catch (err) {
      return err;
    }
  },
  verifyUser: async (loginType: number, token: string) => {
    let email;
    if (loginType === 0) {
      // 일반 유저
      const result = await tokenModule.verifyAccessToken(token);
      email = result.email;
    } else if (loginType === 1) {
      // 카카오 유저
      const result = await tokenModule.verifyKakaoAccessToken(token);
      email = result.email;
    } else {
      // 구글 유저
      const result = await tokenModule.verifyKakaoAccessToken(token);
      email = result.email;
    }
    return email;
  },
};

export default userModule;
