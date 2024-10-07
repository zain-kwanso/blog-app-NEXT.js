import { Post } from "../../@types/post";
import { useState } from "react";
import { GET_POST_QUERY } from "@/utils/qeuries";
import { useQuery } from "@apollo/client";

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
  const { refetch } = useQuery(GET_POST_QUERY, {
    variables: { id: 1 },
    skip: true,
  });

  const fetchPost = async (postId: number): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const { data } = await refetch({ id: postId });

      setPost(data.post);
    } catch (err) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  return { fetchPost, post, loading, error };
};

export default useFetchPost;
