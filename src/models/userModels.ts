import connect from '../database';
import { generalUserInfo } from '../interface/generalUser';

const userModels = {
  findUser: async (arg: generalUserInfo): Promise<boolean> => {
    try {
      const conn = await connect();
      const idCheckQuery = `
        SELECT * FROM USERS WHERE email =? ;
      `;
      const idCheck = await conn.query(idCheckQuery, [arg.email]);
      if (idCheck[0].toString().length === 0) {
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  },
};

export default userModels;
