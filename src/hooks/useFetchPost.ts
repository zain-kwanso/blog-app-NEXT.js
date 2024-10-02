import { Post } from "../../@types/post";
import { useState } from "react";
import { createApolloClient } from "@/app/lib/apolloClient";
import { GET_POST_QUERY } from "@/utils/qeuries";

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
      const client = createApolloClient();
      const { data } = await client.query({
        query: GET_POST_QUERY,
        variables: { id: postId },
      });

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
