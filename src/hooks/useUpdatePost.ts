// src/hooks/useUpdatePost.ts
import { gql, useMutation } from "@apollo/client";

const UPDATE_POST_MUTATION = gql`
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

const useUpdatePost = () => {
  const [updatePostMutation, { loading, error }] =
    useMutation(UPDATE_POST_MUTATION);

  const updatePost = async (
    postId: number,
    title: string,
    content: string
  ): Promise<void> => {
    try {
      const { data } = await updatePostMutation({
        variables: { postId, title, content },
      });

      if (!data.updatePost.success) {
        throw new Error(data.updatePost.message);
      }

      return data.updatePost.post;
    } catch (err) {
      console.error("Error updating post:", err);
      throw new Error("Failed to update post");
    }
  };

  return { updatePost, loading, error };
};

export default useUpdatePost;
