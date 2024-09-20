import { Optional } from "sequelize";
import { data } from "../squelize";

export interface CommentAttribubtes {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  ParentId?: number;
}
export interface UserForComment {
  name: string;
  profileKey: string;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "UserId"> {}

export type CommentInstance = data<Comment, CommentCreationAttributes>;

export interface CommentType extends CommentAttribubtes {
  createdAt: string;
  updatedAt: string;
  User: UserForComment;
  replies?: CommentType[];
}

export type CommentResponse = Comment[];

export interface ReplyComment {
  [key: number]: string | null;
}
