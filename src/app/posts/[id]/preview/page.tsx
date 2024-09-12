import CommentsSection from "@/components/CommentSection";
import PostContent from "@/components/PostContent";
import fetchPost from "@/services/frontendPostService";

export default async function PreviewPostPage({
  params,
}: {
  params: { id: string };
}) {
  const postId = parseInt(params.id, 10);
  console.log("************************* inside the page ********************");
  const post = await fetchPost(postId); // Fetch the post data on the server

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      {post ? (
        <>
          <PostContent post={post} />
          <CommentsSection postId={postId} />
        </>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-center text-red-500">
            <h2>Post not found</h2>
            <p>
              Sorry, the post you are looking for does not exist or has been
              removed.
            </p>
          </div>
        </div>
      )}
      {/* <PostContent post={post} /> Server Component */}
      {/* <CommentsSection postId={params.id} /> Client Component */}
    </div>
  );
}
