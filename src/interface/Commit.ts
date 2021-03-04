export interface commit {
  email: string;
  boardIndex?: number;
  commitIndex?: number;
  title: string;
  content: string;
}

export interface commitFunction {
  email: string;
  commitIndex: number;
}

export interface commitList {
  list: (string | number)[];
}
