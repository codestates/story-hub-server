import connect from '../database';
import { commentList, createComment } from '../interface/Comment';

const commentModels = {
  createComment: async (arg: createComment): Promise<void> => {
    try {
      const conn = await connect();
      // ! 애초에 존재하지 않는 글, 커밋에 대해서는 댓글을 작성할 수 없다.
      const insertCommentSql = `
        INSERT INTO comments (email,  content) values (?, ?);
      `;
      const insertComment = await conn.query(insertCommentSql, [arg.email, arg.content]);
      const commentIndex = JSON.parse(JSON.stringify(insertComment[0])).insertId;

      if (arg.boardIndex) {
        const boardComment = `
          INSERT INTO boards_comments (board_index, comment_index) values (?, ?);
        `;
        await conn.query(boardComment, [arg.boardIndex, commentIndex]);
      } else if (arg.commitIndex) {
        const commitComment = `
          INSERT INTO commits_comments (commit_index, comment_index) values (?, ?);
        `;
        await conn.query(commitComment, [arg.commitIndex, commentIndex]);
      }
    } catch (err) {
      console.log(err);
    }
  },
  getCommentList: async (boardIndex: number): Promise<commentList> => {
    // TODO : 1. join을 통해서 커맨트 내용을 확인한다.
    try {
      const conn = await connect();
      const findComment = `
    select * from comments a left join boards_comments b on a.comment_index = b.comment_index where b.board_index = ? order by b.comment_index desc;
    `;
      const commentlist = await conn.query(findComment, [boardIndex]);
      const result = JSON.parse(JSON.stringify(commentlist[0]));
      return { list: result };
    } catch (err) {
      return err;
    }
  },
};

export default commentModels;
