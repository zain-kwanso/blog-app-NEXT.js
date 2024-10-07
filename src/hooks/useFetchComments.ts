import { useState } from "react";
import { CommentResponse } from "../../@types/comment";
import { GET_COMMENTS_QUERY } from "@/utils/qeuries";
import { useQuery } from "@apollo/client";

const useFetchComments = () => {
  const [comments, setComments] = useState<CommentResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { refetch } = useQuery(GET_COMMENTS_QUERY, {
    variables: { postId: 1 },
    skip: true,
  });

  const fetchComments = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const { data } = await refetch({
        postId,
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
