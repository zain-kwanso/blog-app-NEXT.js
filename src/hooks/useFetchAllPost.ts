import { useState } from "react";
import { Pagination, PostResponse } from "../../@types/post";
import { gql } from "@apollo/client";
import { createApolloClient } from "@/app/lib/apolloClient";

interface FetchPostsArgs {
  pageUrl?: string;
  page?: number;
  limit?: number;
  search?: string;
  userId?: number | null;
}

interface UseFetchAllPosts {
  posts: PostResponse[];
  loading: boolean;
  error: string;
  pagination: Pagination;
  fetchAllPosts: (args: FetchPostsArgs) => Promise<void>;
}

// Define your GraphQL query for fetching posts
const GET_POSTS_QUERY = gql`
  query GetPosts($page: Int, $limit: Int, $search: String, $userId: Int) {
    posts(page: $page, limit: $limit, search: $search, userId: $userId) {
      posts {
        id
        title
        content
        UserId
        User {
          name
        }
      }
      pagination {
        currentPage
        totalPages
        nextPage
        previousPage
      }
    }
  }
`;

const useFetchAllPosts = (): UseFetchAllPosts => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    nextPageUrl: null,
    previousPageUrl: null,
  });

  // Function to fetch posts
  const fetchAllPosts = async ({
    page = 1,
    limit = 10,
    search = "",
    userId = null,
  }: FetchPostsArgs): Promise<void> => {
    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const client = createApolloClient();
      const { data } = await client.query({
        query: GET_POSTS_QUERY,
        variables: { page, limit, search, userId },
      });

      const { posts, pagination } = data?.posts;

      setPosts(posts);
      setPagination(pagination);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    pagination,
    loading,
    fetchAllPosts,
    error,
  };
};

export default useFetchAllPosts;
