import { useState } from "react";

import { CommentResponse } from "../../@types/comment";
import { url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";

const useFetchComments = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState<CommentResponse>([]);

  const fetchComments = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get<CommentResponse>(
        url.posts + `/${postId}/comments`
      );
      setComments(response.data);
    } catch (err) {
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  return { fetchComments, comments, loading, error };
};

export default useFetchComments;
