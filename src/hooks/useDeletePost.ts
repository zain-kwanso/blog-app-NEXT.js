import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_POST_MUTATION } from "@/utils/mutations";

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);

  const deletePost = async (postId: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const idAsNumber =
        typeof postId === "string" ? parseInt(postId, 10) : postId;

      if (isNaN(idAsNumber)) {
        throw new Error("Invalid post ID");
      }

      const { data } = await deletePostMutation({
        variables: { postId: idAsNumber },
      });
      const { success, message } = data.deletePost;

      if (!success) {
        throw new Error(message);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error deleting post.");
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading, error };
};

export default useDeletePost;
