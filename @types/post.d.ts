import { Optional } from "sequelize";
// import { data } from "../squelize";

export interface Post {
  id: number;
  title: string;
  content: string;
  UserId: number;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "UserId"> {}

export type PostInstance = data<Post, PostCreationAttributes>;

export interface PostResponse extends Post {
  createdAt: string;
  updatedAt: string;
  User?: { name: string };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface AllPostResponse {
  posts: PostResponse[];
  pagination: Pagination;
}

export type DeleteEditResponse = {
  message: string;
};
