import { useState } from "react";
import { CommentResponse } from "../../@types/comment";
import { fetchPostCommentsAction } from "@/app/actions/posts";

const useFetchComments = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState<CommentResponse>([]);

  const fetchComments = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchPostCommentsAction(postId);
      setComments(response.data);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  return { fetchComments, comments, loading, error };
};

export default useFetchComments;
