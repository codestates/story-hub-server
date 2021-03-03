export interface createComment {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
  email: string;
  content: string;
}

export interface commentList {
  list: (string | number)[];
}

export interface getCommentList {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
}

export interface likeOrDislike {
  email: string;
  commentIndex: number;
}
