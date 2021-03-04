import connect from '../database';
import { commit } from '../interface/Commit';

const commitModels = {
  create: async (args: commit): Promise<string> => {
    const conn = await connect();
    try {
      const createCommitSql = `
        INSERT INTO commits (email, title, content) VALUES (?, ?, ?);
      `;
      const commitResponse = await conn.query(createCommitSql, [
        args.email,
        args.title,
        args.content,
      ]);

      const commitIdx = JSON.parse(JSON.stringify(commitResponse[0])).insertId;

      const createBoardCommitSql = `
        INSERT INTO board_commits (commit_index, board_index) VALUES (?, ?);
      `;

      await conn.query(createBoardCommitSql, [commitIdx, args.boardIndex]);

      return 'OK';
    } catch (err) {
      return err;
    }
  },

  commitUpdate: async (arg: commit): Promise<boolean> => {
    const conn = await connect();
    try {
      const updateSql = `
        UPDATE commits SET title = ?, content = ?, updated_at = now() where email =? AND commit_index =?;
      `;
      await conn.query(updateSql, [arg.title, arg.content, arg.email, arg.commitIndex]);
      return true;
    } catch (err) {
      return err;
    }
  },
};

export default commitModels;
