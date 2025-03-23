interface IAuthor {
  name: string;
  role: string;
}

interface IComment {
  author: IAuthor;
  content: string;
}

interface ICommunity extends Document {
  author: IAuthor;
  content: string;
  votes: number;
  comments: IComment[];
}

export { IAuthor, IComment, ICommunity };
