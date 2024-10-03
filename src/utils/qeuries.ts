import { gql } from "@apollo/client";

export const GET_POST_QUERY = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`;

export const GET_POSTS_QUERY = gql`
  query GetPosts($page: Int, $limit: Int, $search: String, $userId: Int) {
    posts(page: $page, limit: $limit, search: $search, userId: $userId) {
      posts {
        id
        title
        content
        UserId
        User {
          name
        }
      }
      pagination {
        currentPage
        totalPages
        nextPage
        previousPage
      }
    }
  }
`;

export const GET_COMMENTS_QUERY = gql`
  query GetPostComments($postId: Int!) {
    postComments(postId: $postId) {
      id
      content
      createdAt
      User {
        name
        profilePictureUrl
      }
      replies {
        id
        content
        createdAt
        User {
          name
          profilePictureUrl
        }
      }
    }
  }
`;
