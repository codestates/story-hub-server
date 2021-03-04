export interface comment {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
  commentIndex?: number | undefined;
  email: string;
  content?: string;
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

export interface alertList {
  boardAlert: (string | number)[];
  commitAlert: (string | number)[];
}
