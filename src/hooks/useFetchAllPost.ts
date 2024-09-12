import { useState } from "react";
import { Pagination, PostResponse } from "../../@types/post";
import { backend_url, url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";

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

  const fetchAllPosts = async ({
    pageUrl = url.posts,
    page = 1,
    limit = 10,
    search = "",
    userId = null,
  }: FetchPostsArgs): Promise<void> => {
    setError("");
    setLoading(true);
    setPosts([]);

    try {
      let response;
      if (userId === null) {
        response = await axiosInstance.get(
          `${pageUrl}?page=${page}&limit=${limit}&search=${search}`
        );
      } else {
        response = await axiosInstance.get(
          `${pageUrl}?page=${page}&limit=${limit}&search=${search}&userId=${userId}`
        );
      }

      const data = response.data;
      setPosts(data.posts);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        nextPageUrl: data.pagination.nextPage,
        previousPageUrl: data.pagination.previousPage,
      });
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
