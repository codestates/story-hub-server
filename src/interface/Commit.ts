export interface commit {
  email: string;
  boardIndex?: string;
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
  boardIndex?: string;
}
