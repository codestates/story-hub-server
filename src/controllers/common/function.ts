import { userInfo } from '../../interface/User';

import verifyModule from '../../token/verifyToken';

export default function foo(): string {
  return '';
}
export async function getUserInfo(token: string, loginType: number): Promise<userInfo> {
  const verifyUserInfo = await verifyModule.verifyUser(loginType, token);
  const { email, userName, nickname } = verifyUserInfo;
  return { email, userName, nickname };
}
