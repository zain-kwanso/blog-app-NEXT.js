import { getAllPosts, getPostsByUser } from "@/services/postService";

export const resolvers = {
  Query: {
    // Resolver for fetching posts
    // @ts-ignore
    posts: async (_parent, args) => {
      const { page = 1, limit = 10, search = "", userId = null } = args;

      try {
        let result;
        if (userId) {
          result = await getPostsByUser(userId, page, limit, search);
        } else {
          result = await getAllPosts(page, limit, search);
        }

        const { rows: posts, totalPages, nextPage, previousPage } = result;

        return {
          posts,
          pagination: {
            currentPage: page,
            totalPages,
            nextPage,
            previousPage,
          },
        };
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  },
};
