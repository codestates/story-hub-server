import connect from '../database';
import { createComment } from '../interface/Comment';

const commentModels = {
  createComment: async (arg: createComment): Promise<void> => {
    try {
      const conn = await connect();
      // ! 애초에 존재하지 않는 글, 커밋에 대해서는 댓글을 작성할 수 없다.
      const insertCommentSql = `
        INSERT INTO comments (email, title, content) values (?, ?, ?);
      `;
      const insertComment = await conn.query(insertCommentSql, [arg.email, arg.title, arg.content]);
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
};

export default commentModels;
