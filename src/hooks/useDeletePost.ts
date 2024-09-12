// src/hooks/useDeletePost.ts
import { useState } from "react";

import { DeleteEditResponse } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deletePost = async (postId: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.delete<DeleteEditResponse>(
        `${url.posts}/${postId}/delete`
      );
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
