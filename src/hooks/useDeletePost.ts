// src/hooks/useDeletePost.ts
import { useState } from "react";

import { DeleteEditResponse } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";
import { deletePostAction } from "@/app/actions/posts";

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deletePost = async (postId: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await deletePostAction(postId);
      if (response.error) {
        throw new Error(response.error);
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
