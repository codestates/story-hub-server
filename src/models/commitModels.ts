import connect from '../database';
import { CommitCreate } from '../interface/Commit';

const commitModels = {
  create: async (args: CommitCreate): Promise<string> => {
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
};

export default commitModels;
