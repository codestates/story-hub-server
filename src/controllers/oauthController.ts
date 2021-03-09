import { Request, Response } from 'express';
import oauthModels from '../models/oauthModels';
import tokenModule from '../token';

const oauthModule = {
  kakao: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      console.log(authorization);

      const response = await tokenModule.verifyKakaoAccessToken(
        String(authorization?.split(' ')[1])
      );
      const { email, userName, nickname } = response;
      await oauthModels.signWithLogin({ email, userName, nickname });
      return res.json({ loginType: 1 });
    } catch (err) {
      return res.send(err);
    }
  },
  google: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      const token = String(authorization?.split(' ')[1]);
      const response = await tokenModule.verifyGoogleAccessToken(token);
      const { userName, email, nickname } = response;
      await oauthModels.signWithLogin({ userName, email, nickname });

      return res.json({ loginType: 2 });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
