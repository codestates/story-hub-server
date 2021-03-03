export interface AddBoard {
  email?: string;
  title: string;
  content: string;
  optionName: string;
  genreName: string[];
  minLength: number;
  maxLength: number;
  etc?: string;
}

export interface BoardList {
  hotStory: string[];
  newStory: string[];
}

export interface LikeType {
  email: string;
  boardIndex: number;
}

export interface SearchTitle {
  title: string;
}

export interface deleteBoard {
  email: string;
  boardIndex: number;
}
