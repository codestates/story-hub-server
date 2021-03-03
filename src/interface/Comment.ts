export interface createComment {
  boardIndex?: number | undefined;
  commitIndex?: number | undefined;
  email: string;
  title: string;
  content: string;
}
