import connect from '../database';
import {
  AddBoard,
  BoardList,
  DeleteBoard,
  LikeType,
  EmailInfo,
  SearchTitle,
  UpdateBoard,
} from '../interface/Board';

const boardModels = {
  createBoard: async (args: AddBoard): Promise<string> => {
    try {
      const conn = await connect();

      const countBoard = `
      select board_index from boards order by board_index desc limit 1;
      `;
      const totalCount = await conn.query(countBoard);

      let nextIndex = JSON.parse(JSON.stringify(totalCount[0]));

      const findIndex = nextIndex.length === 0 ? (nextIndex = 1) : nextIndex[0].board_index + 1;

      // insert board
      const insertBoardSql = `
      INSERT INTO boards (email, title, content, description, category) Values (?, ?, ?, ?, ?)
      `;
      await conn.query(insertBoardSql, [
        args.email,
        args.title,
        args.content,
        args.description,
        args.category,
      ]);

      const insertCommitOptionSql = `
        INSERT INTO commits_options (board_index, option_name, min_length, max_length, etc) VALUES (?, ?, ?, ?, ?);
      `;
      await conn.query(insertCommitOptionSql, [
        findIndex,
        args.optionName,
        args.minLength,
        args.maxLength,
        args.etc || null,
      ]);

      return 'OK';
    } catch (err) {
      return err;
    }
  },
  hotAndNewList: async (): Promise<BoardList> => {
    const conn = await connect();

    const hotStorySql = `
    select b.*, u.nickname from boards as b inner join users as u on u.email = b.email ORDER BY b.up_count DESC;
    `;
    const hotStoryList = await conn.query(hotStorySql);
    const convertHotStory = JSON.parse(JSON.stringify(hotStoryList));

    const newStorySql = `
    select b.*, u.nickname from boards as b inner join users as u on u.email = b.email ORDER BY b.created_at DESC;
    `;
    const newStoryList = await conn.query(newStorySql);
    const convertNewStory = JSON.parse(JSON.stringify(newStoryList));
    return { hotStory: convertHotStory, newStory: convertNewStory };
  },
  boardLike: async (args: LikeType): Promise<string> => {
    try {
      const conn = await connect();

      const checkLikeSql = `
      SELECT check_up_down FROM board_up_down WHERE email = ?
      `;

      const checkLike = await conn.query(checkLikeSql, [args.email]);
      const checkLikeStr = JSON.parse(JSON.stringify(checkLike[0]));

      const changeSql = `
        UPDATE board_up_down SET check_up_down = 1 WHERE email = ?
        `;

      const upCount = `
        UPDATE boards SET up_count = up_count + 1 WHERE email = ? AND board_index = ?;
        `;

      if (checkLikeStr.length === 0) {
        await conn.query(upCount, [args.email, args.boardIndex]);

        const insertSql = `
        INSERT INTO board_up_down (email, board_index, check_up_down) VALUES (?, ?, ?);
        `;

        await conn.query(insertSql, [args.email, args.boardIndex, true]);
      } else if (checkLikeStr[0].check_up_down === 0) {
        const upLike = `
          UPDATE boards SET down_count = down_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(upLike, [args.email, args.boardIndex]);

        await conn.query(changeSql, [args.email]);

        await conn.query(upCount, [args.email, args.boardIndex]);
      } else if (checkLikeStr[0].check_up_down === 1) {
        const downSql = `
          UPDATE boards SET up_count = up_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(downSql, [args.email, args.boardIndex]);

        const removeBoardUpDown = `
          DELETE FROM board_up_down WHERE email = ?;
        `;

        await conn.query(removeBoardUpDown, [args.email]);
      }
      return 'OK';
    } catch (err) {
      return err;
    }
  },
  boardDisLike: async (args: LikeType): Promise<string> => {
    try {
      const conn = await connect();

      const checkLikeSql = `
      SELECT check_up_down FROM board_up_down WHERE email = ?
      `;

      const checkLike = await conn.query(checkLikeSql, [args.email]);
      const checkLikeStr = JSON.parse(JSON.stringify(checkLike[0]));

      const changeSql = `
        UPDATE board_up_down SET check_up_down = 0 WHERE email = ?
        `;

      const upCount = `
        UPDATE boards SET down_count = down_count + 1 WHERE email = ? AND board_index = ?;
        `;

      if (checkLikeStr.length === 0) {
        await conn.query(upCount, [args.email, args.boardIndex]);

        const insertSql = `
        INSERT INTO board_up_down (email, board_index, check_up_down) VALUES (?, ?, ?);
        `;

        await conn.query(insertSql, [args.email, args.boardIndex, false]);
      } else if (checkLikeStr[0].check_up_down === 0) {
        const downSql = `
          UPDATE boards SET down_count = down_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(downSql, [args.email, args.boardIndex]);

        const removeBoardUpDown = `
          DELETE FROM board_up_down WHERE email = ?;
        `;

        await conn.query(removeBoardUpDown, [args.email]);
      } else if (checkLikeStr[0].check_up_down === 1) {
        const downLike = `
          UPDATE boards SET up_count = up_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(downLike, [args.email, args.boardIndex]);

        await conn.query(changeSql, [args.email]);

        await conn.query(upCount, [args.email, args.boardIndex]);
      }

      return 'OK';
    } catch (err) {
      return err;
    }
  },
  searchTitle: async (args: SearchTitle): Promise<string[]> => {
    const conn = await connect();

    const findTitleSql = `
      SELECT * FROM boards WHERE title LIKE ?
    `;

    const findList = await conn.query(findTitleSql, [`%${args}%`]);
    const list = JSON.parse(JSON.stringify(findList[0]));

    return list;
  },
  boardDelete: async (args: DeleteBoard): Promise<string> => {
    try {
      const conn = await connect();

      const removeSql = `
      DELETE FROM boards WHERE email = ? and board_index = ?
      `;

      await conn.query(removeSql, [args.email, args.boardIndex]);
      return 'OK';
    } catch (err) {
      return err;
    }
  },
  boardUpdate: async (args: UpdateBoard): Promise<string> => {
    const conn = await connect();
    // const findBoardMergeSql = `
    //   SELECT * FROM board_commits WHERE board_index = ?
    // `;
    // const findMerge = await conn.query(findBoardMergeSql, [args.boardIndex]);
    // const findMergeArr = JSON.parse(JSON.stringify(findMerge[0]));

    // if (findMergeArr.length === 0) {
    const updateSql = `
        UPDATE boards SET title = ?, content = ? WHERE board_index = ?
      `;
    await conn.query(updateSql, [args.title, args.content, args.boardIndex]);
    return 'OK';
    // }
    // return 'Fail';
  },
  myPageInfo: async (args: EmailInfo): Promise<string[]> => {
    const conn = await connect();

    const myBoardInfoSql = `
      SELECT * FROM boards WHERE email = ? ORDER BY created_at DESC;
    `;
    const myBoardInfo = await conn.query(myBoardInfoSql, [args.email]);
    const myBoardInfoArr = JSON.parse(JSON.stringify(myBoardInfo[0]));

    return myBoardInfoArr;
  },
  myFavoriteList: async (args: EmailInfo): Promise<string[]> => {
    const conn = await connect();

    const favoriteListSql = `
    SELECT u.nickname, b.board_index, content, b.title, b.up_count, b.created_at FROM users_boards_favorites as ubf
    LEFT JOIN boards as b
    ON b.board_index = ubf.board_index
    LEFT JOIN users as u
    ON u.email = b.email
    WHERE ubf.email = ?
    ORDER BY ubf.created_at DESC;
    `;
    const favoriteList = await conn.query(favoriteListSql, [args.email]);
    const favoriteListArr = JSON.parse(JSON.stringify(favoriteList[0]));

    return favoriteListArr;
  },
  mypageDetailList: async (args: EmailInfo): Promise<string[]> => {
    const conn = await connect();

    try {
      const result = [
        'SELECT title, content, up_count FROM boards WHERE board_index = 46;',

        `SELECT c.title, c.up_count, c.created_at FROM commits as c
          LEFT JOIN boards_commits as bc
          ON c.commit_index = bc.commit_index
          WHERE bc.board_index = ?`,

        `SELECT c.content, c.up_count, c.created_at FROM comments as c
          LEFT JOIN boards_comments as bc
          ON c.comment_index = bc.comment_index
          WHERE bc.board_index = ?`,
      ];
      const detailList = await Promise.all(
        result.map(async (item) => {
          const detailListInfo = await conn.query(item, [args.boardIndex]);
          const detailListArr = JSON.parse(JSON.stringify(detailListInfo[0]));
          return detailListArr;
        })
      );

      return detailList;
    } catch (err) {
      return err;
    }
  },
  storyDetailList: async (index: string): Promise<string[]> => {
    const conn = await connect();

    try {
      const findEmailSql = `
        SELECT u.email FROM users AS u LEFT JOIN boards AS b ON u.email = b.email WHERE b.board_index = ?
      `;

      const getEmailJson = await conn.query(findEmailSql, [index]);
      const getEmail = JSON.parse(JSON.stringify(getEmailJson))[0];
      const { email } = getEmail[0];

      // 1. 해당 게시글의 nickname, description 가져오기
      // 2. 해당 게시글의 commit_option 가져오기
      // 3. 해당 게시글의 글쓴이의 다른 글
      const result = [
        'SELECT u.nickname, b.description FROM boards AS b LEFT JOIN users AS u ON u.email = b.email WHERE b.board_index = ?',
        'SELECT co.option_name, co.min_length, co.max_length, co.etc FROM commits_options AS co INNER JOIN boards AS b ON co.board_index = b.board_index WHERE b.board_index = ?',
        'SELECT b.title FROM boards AS b WHERE email = ?',
      ];

      const detailList = await Promise.all(
        result.map(async (item, idx) => {
          const detailListInfo = await conn.query(item, [idx === 2 ? email : index]);
          const detailListArr = JSON.parse(JSON.stringify(detailListInfo[0]));
          return detailListArr;
        })
      );

      return detailList;
    } catch (err) {
      return err;
    }
  },
  storyDetailContent: async (boardIndex: string): Promise<string[]> => {
    const conn = await connect();
    try {
      const getBoardAndUserInfoSql = `
      SELECT u.nickname, b.title, b.content FROM boards AS b INNER JOIN users AS u ON b.email = u.email WHERE board_index = ?;
      `;

      const boardUserInfo = await conn.query(getBoardAndUserInfoSql, [boardIndex]);
      const boardUserList = JSON.parse(JSON.stringify(boardUserInfo[0]));

      const storyContentSql = `
      SELECT u.nickname, c.content AS commitContent FROM boards AS b
      INNER JOIN boards_commits AS bc
      ON b.board_index = bc.board_index
      INNER JOIN commits AS c
      ON bc.commit_index = c.commit_index
      INNER JOIN users AS u
      ON u.email = c.email 
      WHERE bc.merge_check = 1 AND b.board_index = ?;
      `;
      const contentResponse = await conn.query(storyContentSql, [boardIndex]);
      const storyContentList = JSON.parse(JSON.stringify(contentResponse[0]));

      return [boardUserList, storyContentList];
    } catch (err) {
      return err;
    }
  },
};

export default boardModels;
