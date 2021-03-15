import { Request, Response } from 'express';
import oauthModels from '../models/oauthModels';
import userModels from '../models/userModels';
import tokenModule from '../token';

const { createAccessToken } = tokenModule;
const oauthModule = {
  kakao: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { authorization } = req.headers;
      console.log(authorization);

      const response = await tokenModule.verifyKakaoAccessToken(
        String(authorization?.split(' ')[1])
      );
      const { email, userName, nickname } = response;
      const joinCheck = await userModels.findUser({ email });
      // false 회원가입이 되어있는 상태라면
      if (joinCheck.onCheck) {
        // TODO : 회원가입 시키기
        await oauthModels.signWithLogin({ email, userName, nickname });
      }

      // TODO : 토큰 만들고 내보내기
      const accessToken = await createAccessToken({ email, userName, nickname });
      return res.json({ accessToken });
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
      const joinCheck = await userModels.findUser({ email });
      // false 회원가입이 되어있는 상태라면
      if (joinCheck.onCheck) {
        // TODO : 회원가입 시키기
        await oauthModels.signWithLogin({ email, userName, nickname });
      }

      // TODO : 토큰 만들고 내보내기
      const accessToken = await createAccessToken({ email, userName, nickname });

      return res.json({ accessToken });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
