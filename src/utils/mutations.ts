import { gql } from "@apollo/client";

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;
