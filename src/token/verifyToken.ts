import { generalUserInfo } from '../interface/generalUser';
import { oauthUserInfo } from '../interface/Oauth';
import tokenModule from './index';

const verifyModule = {
  verifyUser: async (
    loginType: number,
    token: string
  ): Promise<oauthUserInfo | generalUserInfo> => {
    if (loginType === 0) {
      // 일반 유저
      const result = await tokenModule.verifyAccessToken(token);
      return { email: result.email, nickname: result.nickname, userName: result.userName };
    }
    if (loginType === 1) {
      // 카카오 유저
      const result = await tokenModule.verifyKakaoAccessToken(token);
      return { email: result.email, nickname: result.name, userName: result.id };
    }
    // 구글 유저
    const result = await tokenModule.verifyGoogleAccessToken(token);
    return { email: result.email, nickname: result.name, userName: result.id };
  },
};

export default verifyModule;
