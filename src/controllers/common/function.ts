import { userInfo } from '../../interface/user';

import verifyModule from '../../token/verifyToken';

export default function foo(): string {
  return '';
}
export async function getUserInfo(token: string, loginType: number): Promise<userInfo> {
  console.log(token, loginType);
  const verifyUserInfo = await verifyModule.verifyUser(loginType, token);
  const { email, userName, nickname } = verifyUserInfo;
  return { email, userName, nickname };
}
