import connect from '../database';
import { KakaoUser, userInfo } from '../interface/Oauth';

const oauthModels = {
  kakao: async (arg: KakaoUser): Promise<void> => {
    try {
      const conn = await connect();

      const sql = 'SELECT * FROM users WHERE email = ?';
      const result = await conn.query(sql, arg.email);

      // TODO : 회원 정보가 없으면 회원가입 후 로그인, 회원 정보가 있다면 바로 로그인
      // 유저 정보가 없는 경우 -> db에 저장한다.
      if (result[0].toString().length === 0) {
        const saveSql = 'INSERT INTO users (email, user_name, nickname) VALUES (?, ?, ?)';
        await conn.query(saveSql, [arg.email, arg.userName, arg.nickname]);
      }
    } catch (err) {
      console.log(err);
    }
  },
  google: async (arg: userInfo): Promise<userInfo> => {
    try {
      const conn = await connect();
      const sql = 'SELECT * FROM USERS WHERE email = ?';
      const check = await conn.query(sql, arg.email);

      if (check[0].toString.length === 0) {
        const insertSql = 'INSERT INTO USERS (email, user_name, nickname) values (?, ?, ?)';
        const create = await conn.query(insertSql, [arg.email, arg.id, arg.name]);
        console.log(create);
        return arg;
      }
      return arg;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

export default oauthModels;
