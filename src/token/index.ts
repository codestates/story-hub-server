import axios from 'axios';
import jwt from 'jsonwebtoken';
import { generalUserInfo } from '../interface/generalUser';
import { oauthUserInfo } from '../interface/Oauth';

const ACCESS_SECRET: string = String(process.env.ACCESS_TOKEN_SECRET);

const tokenModule = {
  createAccessToken: (userData: generalUserInfo): string => {
    console.log(ACCESS_SECRET, userData);
    const accessToken = jwt.sign(userData, ACCESS_SECRET, {
      expiresIn: '1 days',
    });
    return accessToken;
  },

  verifyAccessToken: (accessToken: string): generalUserInfo => {
    const userInfo = jwt.verify(accessToken, ACCESS_SECRET);
    const result = JSON.parse(JSON.stringify(userInfo));

    return { email: result.email };
  },
  verifyKakaoAccessToken: async (accessToken: any): Promise<oauthUserInfo> => {
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
    return { email, id, name };
  },
  verifyGoogleAccessToken: (accessToken: string): generalUserInfo => {
    console.log(accessToken);
    return { email: 'resdf' };
  },
};

export default tokenModule;
