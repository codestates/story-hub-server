export interface createComment {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
  email: string;
  content: string;
}

export interface getCommentList {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
}

export interface commentList {
  list: (string | number)[];
}
