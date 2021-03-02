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

      let nextIndex = JSON.parse(JSON.stringify(totalCount[0]));
      const findIndex = nextIndex.length === 0 ? (nextIndex = 1) : nextIndex[0].board_index + 1;

      // insert board
      const insertBoardSql = `
      INSERT INTO boards (email, title, content) Values (?, ?, ?)
      `;
      await conn.query(insertBoardSql, [args.email, args.title, args.content]);

      const insertCommitOptionSql = `
        INSERT INTO commit_option(board_index, option_name, min_length, max_length, etc) VALUES (?, ?, ?, ?, ?);
      `;
      await conn.query(insertCommitOptionSql, [
        findIndex,
        args.optionName,
        args.minLength,
        args.maxLength,
        args.etc || null,
      ]);
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
      return 'OK';
    } catch (err) {
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
};

export default boardModels;
