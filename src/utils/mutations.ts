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

export const SIGNIN_MUTATION = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      success
      message
      status
      user {
        id
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      success
      message
      status
    }
  }
`;
