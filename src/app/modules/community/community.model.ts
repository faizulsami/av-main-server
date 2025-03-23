import mongoose, { Schema } from "mongoose";
import { IAuthor, IComment, ICommunity } from "./community.interfaces";

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  role: { type: String },
});

const CommentSchema = new Schema<IComment>(
  {
    author: { type: AuthorSchema, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const CommunitySchema = new Schema<ICommunity>(
  {
    author: { type: AuthorSchema, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

const Community = mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;
