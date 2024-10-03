// src/hooks/useUpdatePost.ts
import { UPDATE_POST_MUTATION } from "@/utils/mutations";
import { gql, useMutation } from "@apollo/client";

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
