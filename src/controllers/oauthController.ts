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
      const { nickname } = profile;
      const userName = userInfo.data.id;

      await oauthModels.kakao({ email, userName, nickname });

      return res.json({ email, userName, nickname });
    } catch (err) {
      return res.send(err);
    }
  },
};

export default oauthModule;
