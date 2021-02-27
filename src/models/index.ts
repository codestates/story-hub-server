import connect from '../database';

interface userInfo {
  id: string;
  email: string;
  name: string;
}

const oauthModel = {
  findUser: async (arg: userInfo): Promise<userInfo> => {
    try {
      const conn = await connect();
      const sql = 'SELECT * FROM USERS WHERE email = ?';
      const check = await conn.query(sql, arg.email);
      console.log(check[0].toString.length);
      if (check[0].toString.length === 0) {
        console.log('testsea@@@');
        const insertSql = `
      INSERT INTO USERS (email, user_name, nickname) values (?, ?, ?)`;
        const create = await conn.query(insertSql, [
          arg.email,
          arg.id,
          arg.name,
        ]);
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

export default oauthModel;
