import connect from '../database';
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
    console.log(arg.commitIndex);
    try {
      const conn = await connect();
      //! TODO : 1. 내가 좋아요한 게시물 전체를 가져오기
      const baseCheck = `
        SELECT commit_index from commits_up_down where email = ?; 
      `;
      const baseReq = await conn.query(baseCheck, [arg.email]);
      const baseRes = JSON.parse(JSON.stringify(baseReq[0]));
      const like: number[] = [];
      baseRes.map((list: any) => like.push(list.commit_index));
      console.log(like);
      if (!like.includes(arg.commitIndex)) {
        console.log('걸린다 ㅁㅁㅁㅁ');
        //! TODO : 좋아요한 목록중에 입력받은 목록이 없다면 새롭게 추가해주고 up_count 늘려주기
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
      console.log('안걸린다');
      // TODO : 사용자가 이미 좋아요를 했거나 싫어요를 한 상태이다.

      const checkQuery = `
        SELECT check_up_down from commits_up_down where commit_index = ? AND email = ?;
      `;
      const checkReq = await conn.query(checkQuery, [arg.commitIndex, arg.email]);
      const checkRes = JSON.parse(JSON.stringify(checkReq[0]));
      if (checkRes[0].check_up_down) {
        // ! 좋아요를 누른 상태
        // TODO : 좋아요가 눌린 상태라면 comment에 upcount를 하나 삭제해주고 내가 좋아한 목록에서 지워준다.
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
      console.log('이미 싫어요를 눌렀어요');
      // 싫어요가 눌린 상태라면 comment에 downcount하나를 줄이고 upcount를 늘려주고 up_down목록상태에서
      const countUpdate = `
        UPDATE commits SET up_count = up_count + 1, down_count = down_count -1 where commit_index = ?;
      `;
      await conn.query(countUpdate, arg.commitIndex);
      // 싫어요 상태를 좋아요로 바꿔준다 (0) => (1)
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
};

export default commitModels;
