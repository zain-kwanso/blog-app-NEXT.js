"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import useFetchAllPosts from "@/hooks/useFetchAllPost";
import { Post } from "../../../@types/post";
import useCustomNavigation from "@/hooks/useCustomNavigation";

const HomePage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { posts, pagination, loading, fetchAllPosts } = useFetchAllPosts();
  const { navigateToPreviewPostPage } = useCustomNavigation();

  useEffect(() => {
    fetchAllPosts({ page: currentPage, limit: itemsPerPage, search });
  }, [currentPage, itemsPerPage]);

  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/?page=${page}&limit=${itemsPerPage}&search=${search}`);
  };
  const handlePostClick = (post: Post) => {
    navigateToPreviewPostPage(post.id);
  };
  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    router.push(`/?page=1&limit=${newLimit}&search=${search}`);
  };

  const fetchPostsWithSearch = async (debouncedSearch: string) => {
    setSearch(debouncedSearch);

    if (currentPage === 1) {
      fetchAllPosts({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
    } else {
      setCurrentPage(1);
    }
    router.push(
      `/?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}`
    );
  };

  return (
    <>
      <div className="sticky top-16 bg-white shadow-md z-10 px-4 w-full flex justify-between items-center py-8">
        <div className="w-1/2 pr-4">
          <SearchBar
            search={search}
            setSearch={setSearch}
            fetchPostsWithSearch={fetchPostsWithSearch}
          />
        </div>
      </div>

      <div className="pt-20 flex flex-col h-full justify-between flex-1 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 p-4">
          {posts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg mt-10">
              {search
                ? `No posts found matching "${search}".`
                : "No posts available. Please check back later or create a new post."}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
                isUserPost={false}
              />
            ))
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
};

export default HomePage;
