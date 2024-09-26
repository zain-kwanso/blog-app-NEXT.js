import { Post, PostResponse } from "../../@types/post";
import { url } from "@/utils/URL";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { fetchPostAction } from "@/app/actions/posts";

interface UseFetchPost {
  fetchPost: (postId: number) => Promise<void>;
  post: Post | null;
  loading: boolean;
  error: string;
}

const useFetchPost = (): UseFetchPost => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);

  const fetchPost = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchPostAction(postId);

      setPost(response.data);
    } catch (err) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  return { fetchPost, post, loading, error };
};

export default useFetchPost;
