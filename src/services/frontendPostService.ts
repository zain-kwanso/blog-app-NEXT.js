import { createApolloClient } from "@/lib/apolloClient";
import { GET_POST_QUERY } from "@/utils/qeuries";

const fetchPost = async (postId: number) => {
  try {
    const client = createApolloClient();
    const { data } = await client.query({
      query: GET_POST_QUERY,
      variables: { id: postId },
    });

    return data.post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
};

export default fetchPost;
