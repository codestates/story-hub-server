import connect from '../database';
import { commit, commitDelete } from '../interface/Commit';

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

  myPageCommit: async (args: commit): Promise<string[]> => {
    const conn = await connect();

    try {
      const listSql = `
        SELECT title, up_count, created_at FROM commits WHERE email = ? ORDER BY c.created_at DESC;
      `;

      const list = await conn.query(listSql, [args.email]);
      const commitList = JSON.parse(JSON.stringify(list[0]));

      return commitList;
    } catch (err) {
      return err;
    }
  },

  commitDelete: async (arg: commitDelete): Promise<boolean> => {
    const conn = await connect();
    try {
      const deleteSql = `
        DELETE from commits where email = ? AND commit_index = ?;
      `;
      await conn.query(deleteSql, [arg.email, arg.commitIndex]);
      return true;
    }catch(err){
      return err;
    }
  },

  commitAlertList: async (args: commit): Promise<string[]> => {
    const conn = await connect();

    try {
      const alertListSql = `
      SELECT c.title, c.content, c.up_count, c.email, c.created_at FROM boards AS b
      INNER JOIN board_commits AS bc
      ON b.board_index = bc.board_index
      INNER JOIN commits AS c
      ON bc.commit_index = c.commit_index
      WHERE b.email = ?
      ORDER BY c.created_at DESC
      `;

      const alertListResponse = await conn.query(alertListSql, [args.email]);
      const alertList = JSON.parse(JSON.stringify(alertListResponse[0]));

      return alertList;
    } catch (err) {
      return err;
    }
  },
};

export default commitModels;
