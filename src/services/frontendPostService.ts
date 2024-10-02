// services/frontendPostService.ts
import { gql } from "@apollo/client";
import { createApolloClient } from "@/app/lib/apolloClient";

// GraphQL query for fetching a single post
const GET_POST_QUERY = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`;

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
