import { CREATE_COMMENT_MUTATION } from "@/utils/mutations";
import { useMutation } from "@apollo/client";

const useCreateComment = () => {
  const [createCommentMutation, { loading, error }] = useMutation(
    CREATE_COMMENT_MUTATION
  );

  const createComment = async (
    content: string,
    postId: number,
    parentId?: number
  ) => {
    try {
      const { data } = await createCommentMutation({
        variables: { content, postId, parentId },
      });

      if (data?.createComment?.success) {
        return {
          success: true,
          message: data.createComment.message,
          comment: data.createComment.comment,
        };
      } else {
        throw new Error(
          data?.createComment?.message || "Failed to create comment"
        );
      }
    } catch (err) {
      console.error("Error creating comment:", err);
      if (err instanceof Error) {
        throw new Error(err.message || "Failed to create comment.");
      } else {
        throw new Error("Unknown Error Occured");
      }
    }
  };

  return { createComment, loading, error };
};

export default useCreateComment;
