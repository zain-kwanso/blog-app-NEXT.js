import { useQuery } from "@apollo/client";
import { Pagination, PostResponse } from "../../@types/post";
import { useState } from "react";
import { GET_POSTS_QUERY } from "@/utils/qeuries";

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
  fetchAllPosts: (args: FetchPostsArgs) => void;
}

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

  const { refetch } = useQuery(GET_POSTS_QUERY, {
    variables: { page: 1, limit: 10, search: "", userId: null },
    skip: true,
  });

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
      const { data } = await refetch({
        page,
        limit,
        search,
        userId,
      });

      const { posts: fetchedPosts, pagination: fetchedPagination } =
        data?.posts;

      setPosts(fetchedPosts);
      setPagination(fetchedPagination);
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
