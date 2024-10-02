import {
  getAllPosts,
  getPostsByUser,
  getPostService,
} from "@/services/postService";

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

    // Resolver for fetching a single post

    post: async (_parent: unknown, { id }: { id: number }) => {
      try {
        const post = await getPostService(id);
        if (!post) {
          throw new Error("Post not found");
        }
        return post;
      } catch (error) {
        throw new Error("Failed to fetch the post");
      }
    },
  },
};
