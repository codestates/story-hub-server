import axios from 'axios';
import { Request, Response } from 'express';

import oauthModel from '../models';

const oauthModule = {
  google: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userinfo = await axios({
        url: `https://www.googleapis.com/userinfo/v2/me?access_token=${req.body.access_token}`,
      });
      const info = userinfo.data;
      const { id, email, name } = info;
      await oauthModel.findUser({ id, email, name });

      return res.json({ id, email, name });
    } catch (err) {
      return res.send('err');
    }
  },
};

export default oauthModule;
