import jwt from 'jsonwebtoken';
import { generalUserInfo } from '../interface/generalUser';

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
    console.log(userInfo);
    return { email: 'email' };
  },
};

export default tokenModule;
