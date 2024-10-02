import { Post } from "../../@types/post"; // Assuming this defines the Post type
import { useState } from "react";
import { gql } from "@apollo/client"; // Apollo Client imports
import { createApolloClient } from "@/app/lib/apolloClient";

interface UseFetchPost {
  fetchPost: (postId: number) => Promise<void>;
  post: Post | null;
  loading: boolean;
  error: string;
}

// GraphQL query to fetch a single post
const GET_POST_QUERY = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`;

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

      // Set the post data received from GraphQL
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
