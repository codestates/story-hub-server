import connect from '../database';
import { generalUserInfo } from '../interface/generalUser';
import tokenModule from '../token';

const { createAccessToken } = tokenModule;

const userModels = {
  findUser: async (arg: generalUserInfo): Promise<generalUserInfo> => {
    try {
      const conn = await connect();
      const idCheckQuery = `
        SELECT * FROM USERS WHERE email =? ;
      `;
      const idCheck = await conn.query(idCheckQuery, [arg.email]);
      if (idCheck[0].toString().length === 0) {
        return { onCheck: true };
      }
      console.log(idCheck[0]);
      return { onCheck: false };
    } catch (err) {
      return err;
    }
  },
  loginUser: async (arg: generalUserInfo): Promise<generalUserInfo> => {
    try {
      const conn = await connect();
      const loginCheckQuery = `
      SELECT * FROM USERS WHERE email =? AND password =? AND is_delete = 0;
      `;
      const loginCheck = await conn.query(loginCheckQuery, [arg.email, arg.password]);
      if (loginCheck[0].toString().length === 0) {
        return { onCheck: true, message: '비밀번호가 틀렸거나, 탈퇴한 유저입니다.' };
      }
      const userObj = JSON.parse(JSON.stringify(loginCheck[0]));
      const findUserInfo = {
        email: userObj[0].email,
        userName: userObj[0].user_name,
        nickname: userObj[0].nickname,
        onError: false,
      };
      const accessToken = createAccessToken(findUserInfo);
      return { accessToken };
    } catch (err) {
      return err;
    }
  },
  createUser: async (arg: generalUserInfo): Promise<void> => {
    const conn = await connect();
    const signupQuery = `
      INSERT INTO USERS(email, password, user_name, nickname) values (?, ?, ?, ?);
    `;
    await conn.query(signupQuery, [arg.email, arg.password, arg.userName, arg.nickname]);
  },
};

export default userModels;
