import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userInfo } from '../interface/user';

const ACCESS_SECRET: string = String(process.env.ACCESS_TOKEN_SECRET);

const tokenModule = {
  createAccessToken: (userData: userInfo): string => {
    const accessToken = jwt.sign(userData, ACCESS_SECRET, {
      expiresIn: '1 days',
    });
    return accessToken;
  },

  verifyAccessToken: (accessToken: string): userInfo => {
    const verifyUserInfo = jwt.verify(accessToken, ACCESS_SECRET);
    const result = JSON.parse(JSON.stringify(verifyUserInfo));
    return { email: result.email, userName: result.userName, nickname: result.nickname };
  },

  verifyKakaoAccessToken: async (accessToken: any): Promise<userInfo> => {
    const info = await axios({
      url: 'https://kapi.kakao.com/v2/user/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-from/urlencoded;charest=utf-8',
      },
    });
    const { email, profile } = info.data.kakao_account;
    const name = profile.nickname;
    const { id } = info.data;
    return { email, userName: id, nickname: name };
  },

  verifyGoogleAccessToken: async (accessToken: string): Promise<userInfo> => {
    const userinfo = await axios({
      url: `https://www.googleapis.com/userinfo/v2/me?access_token=${accessToken}`,
    });
    return { email: userinfo.data.email, userName: userinfo.data.id, nickname: userinfo.data.name };
  },
};

export default tokenModule;
