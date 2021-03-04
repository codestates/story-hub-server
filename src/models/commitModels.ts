import connect from '../database';
import { commentList } from '../interface/Comment';
import { commit, commitFunction } from '../interface/Commit';

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

  commitDelete: async (arg: commitFunction): Promise<boolean> => {
    const conn = await connect();
    try {
      const deleteSql = `
        DELETE from commits where email = ? AND commit_index = ?;
      `;
      await conn.query(deleteSql, [arg.email, arg.commitIndex]);
      return true;
    } catch (err) {
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
  commitLike: async (arg: commitFunction): Promise<boolean> => {
    try {
      const conn = await connect();

      const baseCheck = `
        SELECT commit_index from commits_up_down where email = ?; 
      `;
      const baseReq = await conn.query(baseCheck, [arg.email]);
      const baseRes = JSON.parse(JSON.stringify(baseReq[0]));
      const like: number[] = [];
      baseRes.map((list: any) => like.push(list.commit_index));

      if (!like.includes(arg.commitIndex)) {
        const newLike = `
          INSERT INTO commits_up_down (email, check_up_down, commit_index) values (?, 1, ?);
        `;
        await conn.query(newLike, [arg.email, arg.commitIndex]);
        const countUp = `
          UPDATE commits SET up_count = up_count + 1 where commit_index = ? 
        `;
        await conn.query(countUp, arg.commitIndex);
        return false;
      }

      const checkQuery = `
        SELECT check_up_down from commits_up_down where commit_index = ? AND email = ?;
      `;
      const checkReq = await conn.query(checkQuery, [arg.commitIndex, arg.email]);
      const checkRes = JSON.parse(JSON.stringify(checkReq[0]));
      if (checkRes[0].check_up_down) {
        const countDown = `
        UPDATE commits SET up_count = up_count - 1 where commit_index = ? 
        `;
        await conn.query(countDown, arg.commitIndex);
        const deletelist = `
          DELETE from commits_up_down where commit_index = ?
        `;
        await conn.query(deletelist, arg.commitIndex);
        return true;
      }

      const countUpdate = `
        UPDATE commits SET up_count = up_count + 1, down_count = down_count -1 where commit_index = ?;
      `;
      await conn.query(countUpdate, arg.commitIndex);

      const toLike = `
        UPDATE commits_up_down SET check_up_down = 1 where commit_index = ?
      `;
      await conn.query(toLike, arg.commitIndex);
      return true;
    } catch (err) {
      console.log(err);
      return true;
    }
  },
  dislikeComment: async (arg: commitFunction): Promise<boolean> => {
    try {
      const conn = await connect();

      const baseCheck = `
        SELECT commit_index from commits_up_down where email = ?; 
      `;
      const baseReq = await conn.query(baseCheck, [arg.email]);
      const baseRes = JSON.parse(JSON.stringify(baseReq[0]));
      const like: number[] = [];
      baseRes.map((list: any) => like.push(list.commit_index));
      if (!like.includes(arg.commitIndex)) {
        const newLike = `
          INSERT INTO commits_up_down (email, check_up_down, commit_index) values (?, 0, ?);
        `;
        await conn.query(newLike, [arg.email, arg.commitIndex]);
        const countUp = `
          UPDATE commits SET down_count = up_count + 1 where commit_index = ? 
        `;
        await conn.query(countUp, [arg.commitIndex]);
        return false;
      }

      const checkQuery = `
        SELECT check_up_down from commits_up_down where commit_index = ? AND email = ?;
      `;
      const checkReq = await conn.query(checkQuery, [arg.commitIndex, arg.email]);
      const checkRes = JSON.parse(JSON.stringify(checkReq[0]));
      if (!checkRes[0].check_up_down) {
        const countDown = `
        UPDATE commits SET down_count = down_count - 1 where commit_index = ? 
        `;
        await conn.query(countDown, arg.commitIndex);
        const deletelist = `
          DELETE from commits_up_down where commit_index = ?
        `;
        await conn.query(deletelist, arg.commitIndex);
        return true;
      }

      const countUpdate = `
        UPDATE comments SET up_count = up_count - 1, down_count = down_count + 1 where commit_index = ?;
      `;
      await conn.query(countUpdate, arg.commitIndex);

      const toLike = `
        UPDATE comments_up_down SET check_up_down = 0 where commit_index = ?
      `;
      await conn.query(toLike, arg.commitIndex);
      return true;
    } catch (err) {
      console.log(err);
      return true;
    }
  },
  commitDetail: async (args: commit): Promise<string[]> => {
    const conn = await connect();
    try {
      const detailSql = `
      SELECT c.commit_index, c.title AS commitTitle, c.content AS commitContent,
      c.visit_count, ct.email AS writer, ct.content AS commentContent, ct.created_at
      FROM commits AS c
      LEFT JOIN commit_comments AS cc
      ON c.commit_index = cc.commit_index
      LEFT JOIN comments AS ct
      ON cc.comment_index = ct.comment_index
      WHERE c.commit_index = ?
      ORDER BY cc.created_at;
      `;
      const result = await conn.query(detailSql, [args.commitIndex]);
      const detailInfo = JSON.parse(JSON.stringify(result[0]));

      return detailInfo;
    } catch (err) {
      return err;
    }
  },
  commitList: async (): Promise<commentList> => {
    const conn = await connect();
    try {
      const getlistSql = `
        SELECT * from commits;
      `;
      const reqList = await conn.query(getlistSql);
      const resList = JSON.parse(JSON.stringify(reqList[0]));

      return { list: resList };
    } catch (err) {
      return err;
    }
  },
  commitUpdateAlert: async (arg: commitFunction): Promise<boolean> => {
    const conn = await connect();
    try {
      const alertUpdateSql = `
        UPDATE boards_commits SET is_checked = 1 where commit_index = ?;
      `;
      await conn.query(alertUpdateSql, arg.commitIndex);
      return true;
    } catch (err) {
      return err;
    }
  },
};

export default commitModels;
