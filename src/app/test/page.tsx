// src/app/test/page.tsx
import { fetchPosts } from "@/services/frontendPostService";
import { PostResponse } from "../../../@types/post";

// Server-side component
export default async function TestPage() {
  let posts: PostResponse[] = [];

  try {
    // Fetch the posts using server-side rendering
    const data = await fetchPosts(1, 10);
    posts = data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-sm text-gray-500">By: {post?.User?.name}</p>
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
    </div>
  );
}
