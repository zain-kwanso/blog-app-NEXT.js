"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import useFetchAllPosts from "@/hooks/useFetchAllPost";
import { Post } from "../../../@types/post";
import useCustomNavigation from "@/hooks/useCustomNavigation";
import Skeleton from "@/components/Skeleton";
import { AuthContext } from "@/context/authContext";
import useDeletePost from "@/hooks/useDeletePost";
import { toast } from "react-toastify";

const HomePage = () => {
  const searchParams = useSearchParams();

  const initialPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const initialLimit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 10;

  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [activeTab, setActiveTab] = useState("allPosts");
  const { posts, pagination, loading, fetchAllPosts } = useFetchAllPosts();
  const {
    navigateToPreviewPostPage,
    navigateToCreatePostPage,
    navigateToEditPostPage,
  } = useCustomNavigation();
  const { user } = useContext(AuthContext);
  const { deletePost, error } = useDeletePost();

  useEffect(() => {
    if (activeTab === "userPosts") {
      fetchAllPosts({
        page: currentPage,
        limit: itemsPerPage,
        search,
        userId: user?.id,
      });
    } else {
      fetchAllPosts({ page: currentPage, limit: itemsPerPage, search });
    }
  }, [currentPage, itemsPerPage, activeTab]);

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

  const handleDeletePost = async (postId: number) => {
    if (!user) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deletePost(postId);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Post deleted successfully!");
      }
      fetchAllPosts({
        page: currentPage,
        limit: itemsPerPage,
        search: search,
      });
    }
  };

  const handleCreatePost = () => {
    navigateToCreatePostPage();
  };

  const handleEditPost = (post: Post) => {
    if (user) {
      navigateToEditPostPage(post.id!);
    } else {
      toast.error("Please log in to edit posts.");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "userPosts") {
      router.push("?filter=user");
    } else if (tab === "allPosts") {
      router.push("/");
    }
    setCurrentPage(1);
  };

  const fetchPostsWithSearch = async (debouncedSearch: string) => {
    setSearch(debouncedSearch);

    if (currentPage === 1) {
      if (activeTab === "userPosts") {
        fetchAllPosts({
          page: currentPage,
          limit: itemsPerPage,
          search,
          userId: user?.id,
        });
      } else {
        fetchAllPosts({ page: currentPage, limit: itemsPerPage, search });
      }
    } else {
      setCurrentPage(1);
    }
    router.push(
      `/?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}`
    );
  };

  return (
    <>
      <div className="sticky top-16 bg-white shadow-md z-10 px-4 w-full py-4">
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <div className="w-1/2 pr-4">
            <SearchBar
              search={search}
              setSearch={setSearch}
              fetchPostsWithSearch={fetchPostsWithSearch}
            />
          </div>
          {user && (
            <div className="flex justify-end">
              <button
                onClick={handleCreatePost}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-20 flex flex-col min-h-screen justify-between">
        <div className="w-full max-w-4xl px-4">
          <div className="border-b border-gray-300">
            <div className="flex justify-start">
              <button
                onClick={() => handleTabChange("allPosts")}
                className={`py-2 px-4 text-center font-semibold text-sm rounded-t-lg transition-all duration-300 border-b-2 ${
                  activeTab === "allPosts"
                    ? "border-purple-600 bg-white text-purple-600"
                    : "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Posts
              </button>
              {user && (
                <button
                  onClick={() => handleTabChange("userPosts")}
                  className={`py-2 px-4 text-center font-semibold text-sm rounded-t-lg transition-all duration-300 border-b-2 ${
                    activeTab === "userPosts"
                      ? "border-purple-600 bg-white text-purple-600"
                      : "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  My Posts
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow w-full flex flex-col items-start">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 p-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 p-4">
              {posts?.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 text-lg mt-10">
                  {search
                    ? `No posts found matching "${search}".`
                    : "No posts available. Please check back later or create a new post."}
                </div>
              ) : (
                posts?.map((post) => (
                  <PostCard
                    key={post?.id}
                    post={post}
                    onClick={handlePostClick}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                    isUserPost={post.UserId === user?.id}
                    isAdmin={user?.isAdmin!}
                  />
                ))
              )}
            </div>
          )}
          <div className="w-full px-4 mt-4">
            {!loading && posts?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination?.totalPages}
                currentLimit={itemsPerPage}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
