import { Optional } from "sequelize";
import { data } from "../squelize";

export interface Post {
  id: number;
  title: string;
  content: string;
  UserId: number;
}

export interface PostFormData {
  title: string;
  content: string;
}

export interface PostCreationAttributes
  extends Optional<Post, "id" | "UserId"> {}

export type PostInstance = data<Post, PostCreationAttributes>;

export interface PostResponse extends Post {
  createdAt: string;
  updatedAt: string;
  User?: { name: string };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  nextPageUrl: number | null;
  previousPageUrl: number | null;
}

export interface AllPostResponse {
  posts: PostResponse[];
  pagination: Pagination;
}

export type DeleteEditResponse = {
  message: string;
};
