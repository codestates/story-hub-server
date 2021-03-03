import connect from '../database';
import { AddBoard, BoardList, LikeType } from '../interface/Board';

const boardModels = {
  createBoard: async (args: AddBoard): Promise<string> => {
    try {
      const conn = await connect();

      // find index
      const countBoard = `
      select board_index from boards order by board_index desc limit 1;
      `;
      const totalCount = await conn.query(countBoard);

      console.log('totalCount', totalCount);
      console.log('들어옴16');

      let nextIndex = JSON.parse(JSON.stringify(totalCount[0]));
      console.log('19', nextIndex);
      const findIndex = nextIndex.length === 0 ? (nextIndex = 1) : nextIndex[0].board_index + 1;
      console.log('findIndex', findIndex);
      // insert board
      const insertBoardSql = `
      INSERT INTO boards (email, title, content) Values (?, ?, ?)
      `;
      await conn.query(insertBoardSql, [args.email, args.title, args.content]);

      console.log('들어옴27');

      const insertCommitOptionSql = `
        INSERT INTO commit_option(board_index, option_name, min_length, max_length, etc) VALUES (?, ?, ?, ?, ?);
      `;
      console.log('확인', findIndex);
      console.log('들어옴34');
      await conn.query(insertCommitOptionSql, [
        findIndex,
        args.optionName,
        args.minLength,
        args.maxLength,
        args.etc || null,
      ]);
      console.log('들어옴42');
      const insertLoop = async () => {
        const genreSql = `
          INSERT INTO board_genre (board_index, genre_code) VALUES (?, ?);
        `;
        Promise.all(
          args.genreName.map(async (genre) => {
            console.log(genre);
            await conn.query(genreSql, [findIndex, genre]);
          })
        );
      };
      insertLoop();
      console.log('들어옴55');
      return 'OK';
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  list: async (): Promise<BoardList> => {
    const conn = await connect();

    const hotStorySql = `
    select b.*, u.email from boards as b inner join users as u on u.email = b.email ORDER BY b.up_count DESC;
    `;
    const hotStoryList = await conn.query(hotStorySql);
    const convertHotStory = JSON.parse(JSON.stringify(hotStoryList));

    const newStorySql = `
    select b.*, u.email from boards as b inner join users as u on u.email = b.email ORDER BY b.created_at DESC;
    `;
    const newStoryList = await conn.query(newStorySql);
    const convertNewStory = JSON.parse(JSON.stringify(newStoryList));
    return { hotStory: convertHotStory, newStory: convertNewStory };
  },
  like: async (args: LikeType): Promise<string> => {
    try {
      const conn = await connect();

      // 해당 게시글 up_count + 1
      const upCount = `
      UPDATE boards SET up_count = up_count + 1 WHERE board_index = ?;
      `;
      await conn.query(upCount, [args.boardIndex]);
      // board_up_down 테이블 email, board_index, check_up_down 1로 변경
      const likeUser = `
      INSERT INTO board_up_down (email, board_index, check_up_down) VALUES (?, ?, ?);
      `;
      await conn.query(likeUser, [args.email, args.boardIndex, true]);
      return 'OK';
    } catch (err) {
      return err;
    }
  },
  disLike: async (args: LikeType): Promise<string> => {
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
        console.log(checkLikeStr[0].check_up_down);
        const downSql = `
          UPDATE boards SET down_count = down_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(downSql, [args.email, args.boardIndex]);

        const removeBoardUpDown = `
          DELETE FROM board_up_down WHERE email = ?;
        `;

        await conn.query(removeBoardUpDown, [args.email]);
      } else if (checkLikeStr[0].check_up_down === 1) {
        // 좋아요가 눌려있는 경우 -> 좋아요를 눌렀지만 취소하고 싫어요를 누를래요
        const downLike = `
          UPDATE boards SET up_count = up_count - 1 WHERE email = ? AND board_index = ?;
        `;

        await conn.query(downLike, [args.email, args.boardIndex]);

        await conn.query(changeSql, [args.email]);

        await conn.query(upCount, [args.email, args.boardIndex]);
      }

      return 'OK';
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

export default boardModels;
