import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    profilePictureUrl: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    UserId: Int!
    User: User!
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: String!
    ParentId: Int
    UserId: Int!
    PostId: Int!
    User: User
    replies: [Comment]
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

  type CommentResponse {
    comments: [Comment]
  }

  type MutationResponse {
    success: Boolean!
    message: String
    post: Post
    comment: Comment
  }

  type Query {
    posts(page: Int, limit: Int, search: String, userId: Int): PostResponse
    post(id: Int!): Post!
    postComments(postId: Int!): [Comment]
  }

  type Mutation {
    createPost(title: String!, content: String!): MutationResponse!
    deletePost(postId: Int!): MutationResponse!
    updatePost(
      postId: Int!
      title: String!
      content: String!
    ): MutationResponse!

    createComment(
      content: String!
      postId: Int!
      parentId: Int
    ): MutationResponse!
    deleteComment(commentId: Int!): MutationResponse!
  }
`;
