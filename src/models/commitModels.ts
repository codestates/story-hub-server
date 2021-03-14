import connect from '../database';
import { commit, commitFunction, commitList } from '../interface/Commit';

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

      const findMergeCountSql = `
        SELECT COUNT(merge_check) as cnt FROM boards_commits WHERE merge_check = 1;
      `;
      const findMergeCount = await conn.query(findMergeCountSql);

      const count = JSON.parse(JSON.stringify(findMergeCount[0]))[0].cnt;

      const createBoardCommitSql = `
        INSERT INTO boards_commits (commit_index, board_index, depth) VALUES (?, ?, ?);
      `;

      await conn.query(createBoardCommitSql, [commitIdx, args.boardIndex, count + 1]);

      return 'OK';
    } catch (err) {
      console.log(err);
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
        SELECT c.commit_index, bc.board_index, c.content, c.title, c.up_count, c.created_at FROM commits as c
        left join boards_commits as bc on c.commit_index = bc.commit_index
        WHERE email = ? ORDER BY created_at DESC;
      `;

      const list = await conn.query(listSql, [args.email]);
      const commitsList = JSON.parse(JSON.stringify(list[0]));
      console.log(commitsList);
      return commitsList;
    } catch (err) {
      return err;
    }
  },

  commitDelete: async (arg: commitFunction): Promise<boolean> => {
    const conn = await connect();
    try {
      // 만약 merge_check이 1이면 삭제할 수 없습니다.
      const findMergeCommitSql = `
      select * from commits as c 
      left join boards_commits as bc
      on c.commit_index = bc.commit_index
      where bc.merge_check = 1 AND c.commit_index = ?;
      `;

      const findMergeCommit = await conn.query(findMergeCommitSql, [arg.commitIndex]);
      const MergeCommitJson = JSON.parse(JSON.stringify(findMergeCommit))[0];
      console.log('sdf', MergeCommitJson);
      console.log('sdf', MergeCommitJson.length);
      if (MergeCommitJson.length > 0) {
        const deleteSql = `
          DELETE from commits where email = ? AND commit_index = ?;
        `;
        await conn.query(deleteSql, [arg.email, arg.commitIndex]);
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  },

  commitAlertList: async (args: commit): Promise<string[]> => {
    const conn = await connect();

    try {
      const alertListSql = `
      select c.commit_index as commitIndex, c.title, c.content, c.up_count as upCount, c.down_count as downCount,
      c.visit_count as visitCount, c.created_at as createdAt, u.nickname from commits c
      left join boards_commits bc
        on c.commit_index = bc.commit_index
      left join boards b
        on bc.board_index = b.board_index
      left join users u
        on c.email = u.email
      where b.email = ?
        AND NOT c.email = ?
        AND bc.is_checked = 0;
      `;

      const alertListResponse = await conn.query(alertListSql, [args.email, args.email]);
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
  commitDetail: async (commitIndex: string, email: string): Promise<string[]> => {
    const conn = await connect();
    try {
      console.log(commitIndex);
      const findUserSql = `
      select * from commits where email = ? AND commit_index = ?;
      `;

      const findUserJson = await conn.query(findUserSql, [email, commitIndex]);
      const findUser = JSON.parse(JSON.stringify(findUserJson));
      const boardWriter = findUser[0];
      console.log('원작자', boardWriter);

      const checkDeleteUserSql = `
      select u.email from commits as c
      left join boards_commits as bc
      on c.commit_index = bc.commit_index
      left join boards as b
      on b.board_index = bc.board_index
      left join users as u
      on b.email = u.email
      where c.commit_index = ?;
      `;

      const checkDeleteUser = await conn.query(checkDeleteUserSql, [commitIndex]);
      const checkDeleteUserJson = JSON.parse(JSON.stringify(checkDeleteUser[0]));
      const commitWriter = checkDeleteUserJson[0].email;
      console.log('클릭자', email);
      console.log('작성자', commitWriter);
      console.log(commitWriter === email);
      const detailSql = `
      SELECT c.commit_index, c.title AS commitTitle, c.content AS commitContent,
      c.visit_count, ct.email AS writer, ct.content AS commentContent, ct.created_at
      FROM commits AS c
      LEFT JOIN commits_comments AS cc
      ON c.commit_index = cc.commit_index
      LEFT JOIN comments AS ct
      ON cc.comment_index = ct.comment_index
      WHERE c.commit_index = ?
      ORDER BY cc.created_at;
      `;
      const result = await conn.query(detailSql, [commitIndex]);
      const detailInfo = JSON.parse(JSON.stringify(result))[0];

      if (boardWriter.length > 0 || commitWriter === email) {
        return [...detailInfo, '1'];
      }
      return boardWriter.length > 0 || commitWriter === email ? [...detailInfo, '1'] : detailInfo;
    } catch (err) {
      return err;
    }
  },
  commitList: async (boardIndex: string): Promise<commitList> => {
    const conn = await connect();
    try {
      console.log(boardIndex);
      const getlistSql = `
      SELECT u.nickname, c.title, c.content, c.created_at, c.commit_index, bc.depth, bc.merge_check FROM boards_commits AS bc
      LEFT JOIN commits AS c
      ON bc.commit_index = c.commit_index
      LEFT JOIN users as u
      ON u.email = c.email
      WHERE bc.board_index = ? ORDER BY c.created_at DESC;
      `;
      const reqList = await conn.query(getlistSql, [boardIndex]);
      const resList = JSON.parse(JSON.stringify(reqList[0]));

      return { list: resList };
    } catch (err) {
      return err;
    }
  },
  commitMergeCheck: async (args: commit): Promise<boolean> => {
    const conn = await connect();
    try {
      const mergeCheckSql = `
        UPDATE boards_commits SET merge_check = 1 WHERE commit_index = ?
      `;
      await conn.query(mergeCheckSql, [args.commitIndex]);

      return true;
    } catch (err) {
      return false;
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
  commitDepth: async (): Promise<commitList> => {
    const conn = await connect();
    try {
      console.log('sdlfiasdfasdfal');
      const findDepth = `
      select a.*, b.depth from boards a left join boards_commits b on a.board_index = b.board_index;
      `;
      const reqlist = await conn.query(findDepth, '');
      console.log('asdlfijasdlf');
      const result = JSON.parse(JSON.stringify(reqlist[0]));
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

export default commitModels;
