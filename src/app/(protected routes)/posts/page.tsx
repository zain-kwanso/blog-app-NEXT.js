import { createApolloClient } from "@/lib/apolloClient";
import { GET_POSTS_QUERY } from "@/utils/qeuries";

// This is a Server Component
export default async function PostsPage() {
  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_POSTS_QUERY,
    variables: {
      page: 1,
      limit: 10,
      search: "",
      userId: null,
    },
  });

  const { posts, pagination } = data.posts;

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(
        (post: {
          id: number;
          title: string;
          content: string;
          User: { name: string };
        }) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Posted by: {post.User.name}</p>
          </div>
        )
      )}

      {/* Example pagination display */}
      <div>
        {pagination.previousPage && <button>Previous Page</button>}
        {pagination.nextPage && <button>Next Page</button>}
      </div>
    </div>
  );
}
