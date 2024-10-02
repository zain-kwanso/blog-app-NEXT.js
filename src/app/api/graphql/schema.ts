import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    UserId: Int!
    User: User! # Assuming each post has a User
  }

  type Pagination {
    currentPage: Int
    totalPages: Int
    nextPage: Int
    previousPage: Int
  }

  type PostResponse {
    posts: [Post]
    pagination: Pagination
  }

  type Query {
    posts(page: Int, limit: Int, search: String, userId: Int): PostResponse
    post(id: Int!): Post!
  }
`;
