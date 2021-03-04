export interface commit {
  email: string;
  boardIndex?: number;
  commitIndex?: number;
  title: string;
  content: string;
}

export interface commitDelete {
  email: string;
  commitIndex: number;
}
