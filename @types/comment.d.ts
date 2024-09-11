import { Optional } from "sequelize";
// import { data } from "../squelize";

export interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  ParentId?: number;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "UserId"> {}

export type CommentInstance = data<Comment, CommentCreationAttributes>;

export interface ResComment extends Comment {
  createdAt: string;
  updatedAt: string;
  User: UserForComment;
  replies?: ResComment[];
}

export type CommentResponse = ResComment[];

export interface ReplyComment {
  [key: number]: string | null;
}
