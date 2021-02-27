import axios from 'axios';
import { Request, Response } from 'express';
import oauthModels from '../models/oauthModels';

const oauthModule = {
  kakao: async (req: Request, res: Response): Promise<Response> => {
    try {
      const accessToken = req.body.access_token;
      const userInfo = await axios({
        url: 'https://kapi.kakao.com/v2/user/me',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-from/urlencoded;charest=utf-8',
        },
      });
      const { email, profile } = userInfo.data.kakao_account;
      const name = profile.nickname;
      const { id } = userInfo.data;

      await oauthModels.signWithLogin({ id, email, name });

      return res.json({ id, email, name });
    } catch (err) {
      return res.send(err);
    }
  },
  google: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userinfo = await axios({
        url: `https://www.googleapis.com/userinfo/v2/me?access_token=${req.body.access_token}`,
      });
      const info = userinfo.data;
      const { id, email, name } = info;
      await oauthModels.signWithLogin({ id, email, name });

      return res.json({ id, email, name });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
