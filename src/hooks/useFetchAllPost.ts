import { useState } from "react";
import axios from "axios";
import { Pagination, PostResponse } from "../../@types/post";
import { backend_url, url } from "@/utils/URL";

interface FetchPostsArgs {
  pageUrl?: string;
  page?: number;
  limit?: number;
  search?: string;
}

interface UseFetchAllPosts {
  posts: PostResponse[];
  loading: boolean;
  error: string;
  pagination: Pagination;
  fetchAllPosts: (args: FetchPostsArgs) => Promise<void>;
  fetchUserPosts: (args: FetchPostsArgs) => Promise<void>;
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
    pageUrl = backend_url + url.posts,
    page = 1,
    limit = 10,
    search = "",
  }: FetchPostsArgs): Promise<void> => {
    setError("");
    setLoading(true);
    setPosts([]);

    try {
      const response = await axios.get(
        `${pageUrl}?page=${page}&limit=${limit}&search=${search}`
      );

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

  const fetchUserPosts = async ({
    pageUrl = backend_url + url.posts,
    page = 1,
    limit = 10,
    search = "",
  }: FetchPostsArgs): Promise<void> => {
    console.log(url.posts);
    fetchAllPosts({ pageUrl, page, limit, search });
  };

  return {
    posts,
    pagination,
    loading,
    fetchAllPosts,
    fetchUserPosts,
    error,
  };
};

export default useFetchAllPosts;
