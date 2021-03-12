import connect from '../database';
import {
  commentList,
  comment,
  getCommentList,
  likeOrDislike,
  alertList,
} from '../interface/Comment';

const commentModels = {
  createComment: async (arg: comment): Promise<void> => {
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
  getCommentList: async (index: getCommentList): Promise<commentList> => {
    // TODO : 1. join을 통해서 커맨트 내용을 확인한다.
    try {
      console.log('들어옴222');
      const conn = await connect();
      const findBoard = `
      select u.nickname, a.content, a.created_at from comments a
      left join boards_comments b 
      on a.comment_index = b.comment_index
      left join users u
      on u.email = a.email
      where b.board_index = ?
      order by b.comment_index desc;
      `;
      const findCommit = `
        select * from comments a left join commits_comments b on a.comment_index = b.comment_index where b.commit_index = ? order by b.comment_index desc;
      `;
      const commentlist = await conn.query(index.boardIndex ? findBoard : findCommit, [
        index.boardIndex ? index.boardIndex : index.commitIndex,
      ]);
      const result = JSON.parse(JSON.stringify(commentlist[0]));
      return { list: result };
    } catch (err) {
      return err;
    }
  },
  likeComment: async (arg: likeOrDislike): Promise<boolean> => {
    console.log(arg.commentIndex);
    try {
      const conn = await connect();
      //! TODO : 1. 내가 좋아요한 게시물 전체를 가져오기
      const baseCheck = `
        SELECT comment_index from comments_up_down where email = ?; 
      `;
      const baseReq = await conn.query(baseCheck, [arg.email]);
      const baseRes = JSON.parse(JSON.stringify(baseReq[0]));
      const like: number[] = [];
      baseRes.map((list: any) => like.push(list.comment_index));
      if (!like.includes(arg.commentIndex)) {
        console.log('걸린다');
        //! TODO : 좋아요한 목록중에 입력받은 목록이 없다면 새롭게 추가해주고 up_count 늘려주기
        const newLike = `
          INSERT INTO comments_up_down (email, check_up_down, comment_index) values (?, 1, ?);
        `;
        await conn.query(newLike, [arg.email, arg.commentIndex]);
        const countUp = `
          UPDATE comments SET up_count = up_count + 1 where comment_index = ? 
        `;
        await conn.query(countUp, arg.commentIndex);
        return false;
      }
      console.log('안걸린다');
      // TODO : 사용자가 이미 좋아요를 했거나 싫어요를 한 상태이다.

      const checkQuery = `
        SELECT check_up_down from comments_up_down where comment_index = ? AND email = ?;
      `;
      const checkReq = await conn.query(checkQuery, [arg.commentIndex, arg.email]);
      const checkRes = JSON.parse(JSON.stringify(checkReq[0]));
      if (checkRes[0].check_up_down) {
        // ! 좋아요를 누른 상태
        // TODO : 좋아요가 눌린 상태라면 comment에 upcount를 하나 삭제해주고 내가 좋아한 목록에서 지워준다.
        const countDown = `
        UPDATE comments SET up_count = up_count - 1 where comment_index = ? 
        `;
        await conn.query(countDown, arg.commentIndex);
        const deletelist = `
          DELETE from comments_up_down where comment_index = ?
        `;
        await conn.query(deletelist, arg.commentIndex);
        return true;
      }
      console.log('이미 싫어요를 눌렀어요');
      // 싫어요가 눌린 상태라면 comment에 downcount하나를 줄이고 upcount를 늘려주고 up_down목록상태에서
      const countUpdate = `
        UPDATE comments SET up_count = up_count + 1, down_count = down_count -1 where comment_index = ?;
      `;
      await conn.query(countUpdate, arg.commentIndex);
      // 싫어요 상태를 좋아요로 바꿔준다 (0) => (1)
      const toLike = `
        UPDATE comments_up_down SET check_up_down = 1 where comment_index = ?
      `;
      await conn.query(toLike, arg.commentIndex);
      return true;
    } catch (err) {
      console.log(err);
      return true;
    }
  },

  dislikeComment: async (arg: likeOrDislike): Promise<boolean> => {
    try {
      const conn = await connect();
      //! TODO : 1. 내가 좋아요, 싫어요한 게시물 전체를 가져오기
      const baseCheck = `
        SELECT comment_index from comments_up_down where email = ?; 
      `;
      const baseReq = await conn.query(baseCheck, [arg.email]);
      const baseRes = JSON.parse(JSON.stringify(baseReq[0]));
      const like: number[] = [];
      baseRes.map((list: any) => like.push(list.comment_index));
      if (!like.includes(arg.commentIndex)) {
        console.log('걸린다');
        //! TODO : 좋아요, 싫어요한 목록중에 입력받은 목록이 없다면 새롭게 추가해주고 down_count 늘려주기
        const newLike = `
          INSERT INTO comments_up_down (email, check_up_down, comment_index) values (?, 0, ?);
        `;
        await conn.query(newLike, [arg.email, arg.commentIndex]);
        const countUp = `
          UPDATE comments SET down_count = up_count + 1 where comment_index = ? 
        `;
        await conn.query(countUp, arg.commentIndex);
        return false;
      }
      console.log('안걸린다');
      // TODO : 사용자가 이미 좋아요를 했거나 싫어요를 한 상태이다.

      const checkQuery = `
        SELECT check_up_down from comments_up_down where comment_index = ? AND email = ?;
      `;
      const checkReq = await conn.query(checkQuery, [arg.commentIndex, arg.email]);
      const checkRes = JSON.parse(JSON.stringify(checkReq[0]));
      if (!checkRes[0].check_up_down) {
        // ! 싫어요를 누른 상태
        // TODO : 싫어요가 눌린 상태라면 comment에 downcount를 하나 삭제해주고 내가 좋아한 목록에서 지워준다.
        const countDown = `
        UPDATE comments SET down_count = down_count - 1 where comment_index = ? 
        `;
        await conn.query(countDown, arg.commentIndex);
        const deletelist = `
          DELETE from comments_up_down where comment_index = ?
        `;
        await conn.query(deletelist, arg.commentIndex);
        return true;
      }
      console.log('이미 좋아요를 눌렀어요');
      // 좋아요가 눌린 상태라면 comment에 upcount하나를 줄이고 downcount를 늘려주고
      const countUpdate = `
        UPDATE comments SET up_count = up_count - 1, down_count = down_count + 1 where comment_index = ?;
      `;
      await conn.query(countUpdate, arg.commentIndex);
      // up_down목록상태에서 좋아요 상태를 싫어요로 바꿔준다 (1) => (0)
      const toLike = `
        UPDATE comments_up_down SET check_up_down = 0 where comment_index = ?
      `;
      await conn.query(toLike, arg.commentIndex);
      return true;
    } catch (err) {
      console.log(err);
      return true;
    }
  },
  editComment: async (arg: comment): Promise<boolean> => {
    try {
      const conn = await connect();
      const editquery = `
        UPDATE comments SET content = ? where comment_index = ? AND email =?;
      `;
      await conn.query(editquery, [arg.content, arg.commentIndex, arg.email]);
      return true;
    } catch (err) {
      return false;
    }
  },

  deleteComment: async (arg: comment): Promise<boolean> => {
    try {
      const conn = await connect();
      const deleteQuery = `
        DELETE from comments where comment_index = ?;
      `;
      await conn.query(deleteQuery, [arg.commentIndex]);
      return true;
    } catch (err) {
      return err;
    }
  },

  // TODO : 내가 작성한 댓글의 목록을 가지고 온다. Board에대한 댓글, Commit에 대한 댓글
  myCommentList: async (arg: comment): Promise<commentList> => {
    try {
      const conn = await connect();
      const listQuery = `
        SELECT email, content, up_count, down_count, created_at from comments where email = ?;
      `;
      const listReq = await conn.query(listQuery, arg.email);
      const listRes = JSON.parse(JSON.stringify(listReq[0]));
      return { list: listRes };
    } catch (err) {
      return err;
    }
  },

  newAlertList: async (arg: comment): Promise<alertList> => {
    try {
      const conn = await connect();
      const alertBoardQuery = `
      select c.comment_index as commentIndex, c.content, c.up_count as upCount,
      c.down_count as downCount, c.created_at as createdAt, u.nickname 
        from comments c
      left join boards_comments bc
        on c.comment_index = bc.comment_index
      left join boards b
        on b.board_index = bc.board_index
      left join users u
        on c.email = u.email 
      where b.email = ?
        and NOT c.email = ?
        and bc.is_checked = 0;
      `;
      const alertCommitQuery = `
        select c.comment_index as commentIndex, c.content, c.up_count as upCount, 
        c.down_count as downCount, c.created_at as createdAt, u.nickname 
          from comments c
        left join commits_comments cc
          on c.comment_index = cc.comment_index
        left join commits cm
          on cc.commit_index = cm.commit_index
        left join users u
          on c.email = u.email 
        where cm.email = ?
          and NOT c.email = ?
          and cc.is_checked = 0;
      `;

      const queryReq = await conn.query(alertBoardQuery + alertCommitQuery, [
        arg.email,
        arg.email,
        arg.email,
        arg.email,
      ]);
      const result = JSON.parse(JSON.stringify(queryReq[0]));
      const boardAlert = result[0];
      const commitAlert = result[1];
      return { boardAlert, commitAlert };
    } catch (err) {
      return err;
    }
  },
  alertCheck: async (arg: comment): Promise<boolean> => {
    try {
      const conn = await connect();
      // TODO : 입력받은 커밋 인덱스가 어디 위치한지 찾는다.
      const a = `
        SELECT exists ( select * from boards_comments where comment_index = ?) as isCheck;
      `;
      const b = `
        SELECT exists ( select * from commits_comments where comment_index = ?) as isCheck;
      `;
      const checkboardReq = await conn.query(a, arg.commentIndex);
      const checkCommitdReq = await conn.query(b, arg.commentIndex);
      const boardRes = JSON.parse(JSON.stringify(checkboardReq[0]));
      if (boardRes[0].isCheck) {
        console.log('보드에 댓글이 있습니다.');
        const alertUpdate = `
          UPDATE boards_comments SET is_checked = 1 where comment_index = ?;
        `;
        await conn.query(alertUpdate, arg.commentIndex);
        return true;
      }
      const commitRes = JSON.parse(JSON.stringify(checkCommitdReq[0]));
      if (commitRes[0].isCheck) {
        console.log('커밋에 댓글이 있습니다.');
        const alertUpdate = `
          UPDATE commits_comments SET is_checked = 1 where comment_index = ?;
        `;
        await conn.query(alertUpdate, arg.commentIndex);
        return true;
      }
      return true;
    } catch (err) {
      return false;
    }
  },
};

export default commentModels;
