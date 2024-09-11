import { useState } from "react";
import axios from "axios";
import { CommentResponse } from "../../@types/comment";
import { backend_url, url } from "@/utils/URL";

const useFetchComments = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState<CommentResponse>([]);

  const fetchComments = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<CommentResponse>(
        backend_url + url.posts + `/${postId}/comments`
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
