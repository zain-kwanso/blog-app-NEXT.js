import { useState } from "react";
import { createApolloClient } from "@/lib/apolloClient";
import { CommentResponse } from "../../@types/comment";
import { GET_COMMENTS_QUERY } from "@/utils/qeuries";

const useFetchComments = () => {
  const [comments, setComments] = useState<CommentResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchComments = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const client = createApolloClient();
      const { data } = await client.query({
        query: GET_COMMENTS_QUERY,
        variables: { postId },
      });

      setComments(data?.postComments || []);
    } catch (err) {
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  return { fetchComments, comments, loading, error };
};

export default useFetchComments;
