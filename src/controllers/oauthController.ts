import { Request, Response } from 'express';
import oauthModels from '../models/oauthModels';
import tokenModule from '../token';

const oauthModule = {
  kakao: async (req: Request, res: Response): Promise<Response> => {
    try {
      const accessToken = req.body.access_token;
      const result = await tokenModule.verifyKakaoAccessToken(accessToken);
      const { email, userName, nickname } = result;
      await oauthModels.signWithLogin({ email, userName, nickname });
      return res.json({ accessToken, type: 1 });
    } catch (err) {
      return res.send(err);
    }
  },
  google: async (req: Request, res: Response): Promise<Response> => {
    try {
      const accessToken = req.body.access_token;
      const response = await tokenModule.verifyGoogleAccessToken(accessToken);
      const { userName, email, nickname } = response;
      await oauthModels.signWithLogin({ userName, email, nickname });

      return res.json({ userName, email, nickname });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
