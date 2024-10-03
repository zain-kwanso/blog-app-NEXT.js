import { gql } from "@apollo/client";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      success
      message
      post {
        id
        title
        content
      }
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($postId: Int!, $title: String!, $content: String!) {
    updatePost(postId: $postId, title: $title, content: $content) {
      success
      message
      post {
        id
        title
        content
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($content: String!, $postId: Int!, $parentId: Int) {
    createComment(content: $content, postId: $postId, parentId: $parentId) {
      success
      message
      comment {
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
