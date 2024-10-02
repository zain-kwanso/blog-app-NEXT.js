import { createApolloClient } from "@/app/lib/apolloClient";
import { gql } from "@apollo/client";

// Update the GraphQL query to include the user's name
const GET_POSTS = gql`
  query GetPosts($page: Int, $limit: Int, $search: String, $userId: Int) {
    posts(page: $page, limit: $limit, search: $search, userId: $userId) {
      posts {
        id
        title
        content
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

// This is a Server Component
export default async function PostsPage() {
  const client = createApolloClient(); // Create an Apollo Client for SSR

  // Fetch data using Apollo Client on the server
  const { data } = await client.query({
    query: GET_POSTS,
    variables: {
      page: 1, // Default to page 1
      limit: 10, // Limit to 10 posts per page
      search: "", // No search query
      userId: null, // No specific user
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
