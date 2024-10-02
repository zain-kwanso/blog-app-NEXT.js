import {
  createPostService,
  deletePostService,
  getAllPosts,
  getPostsByUser,
  getPostService,
  updatePostService,
} from "@/services/postService";

interface Context {
  currentUser: {
    id: number;
    isAdmin: boolean;
  } | null;
}

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

  Mutation: {
    // Mutation to create a post
    createPost: async (
      _parent: unknown,
      { title, content }: { title: string; content: string },
      context: Context
    ) => {
      const { currentUser } = context;

      if (!currentUser) {
        return {
          success: false,
          message: "User is not authenticated.",
        };
      }

      try {
        const newPost = await createPostService(title, content, currentUser.id);
        return {
          success: true,
          message: "Post created successfully",
          post: newPost,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to create the post",
        };
      }
    },
    // Mutation to update a post
    updatePost: async (
      _parent: unknown,
      {
        postId,
        title,
        content,
      }: { postId: number; title: string; content: string },
      context: Context
    ) => {
      const { currentUser } = context;

      if (!currentUser) {
        return {
          success: false,
          message: "User is not authenticated.",
        };
      }

      try {
        const updatedPost = await updatePostService(
          postId,
          title,
          content,
          currentUser.id
        );
        return {
          success: true,
          message: "Post updated successfully",
          post: updatedPost,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update the post",
        };
      }
    },

    // Mutation to delete a post
    deletePost: async (
      _parent: unknown,
      { postId }: { postId: number },
      context: Context
    ) => {
      const { currentUser } = context;

      if (!currentUser) {
        return {
          success: false,
          message: "User is not authenticated.",
        };
      }

      try {
        const result = await deletePostService(
          postId,
          currentUser.id,
          currentUser.isAdmin
        );

        return {
          success: true,
          message: "Post deleted successfully!",
        };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete the post.",
        };
      }
    },
  },
};
