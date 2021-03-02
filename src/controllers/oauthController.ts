import { Request, Response } from 'express';
import oauthModels from '../models/oauthModels';
import tokenModule from '../token';

const oauthModule = {
  kakao: async (req: Request, res: Response): Promise<Response> => {
    try {
      const accessToken = req.body.access_token;
      const result = await tokenModule.verifyKakaoAccessToken(accessToken);
      const { email, id, name } = result;
      await oauthModels.signWithLogin({ email, id, name });
      return res.json({ accessToken, type: 1 });
    } catch (err) {
      return res.send(err);
    }
  },
  google: async (req: Request, res: Response): Promise<Response> => {
    try {
      const accessToken = req.body.access_token;
      const response = await tokenModule.verifyGoogleAccessToken(accessToken);
      const { id, email, name } = response;
      await oauthModels.signWithLogin({ id, email, name });

      return res.json({ id, email, name });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
