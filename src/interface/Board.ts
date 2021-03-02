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
