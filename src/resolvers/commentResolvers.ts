import {
  createCommentService,
  deleteCommentService,
  getPostCommentsService,
} from "@/services/commentService";

export const getPostCommentsResolver = async (
  _parent: unknown,
  { postId }: { postId: number }
) => {
  if (isNaN(postId) || postId <= 0) {
    throw new Error("Invalid post ID");
  }

  try {
    const comments = await getPostCommentsService(postId);
    return comments;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch comments"
    );
  }
};

export const createCommentResolver = async (
  _parent: unknown,
  {
    content,
    postId,
    parentId,
  }: { content: string; postId: number; parentId?: number },
  context: { currentUser: { id: number } | null }
) => {
  const { currentUser } = context;

  if (!currentUser) {
    return {
      success: false,
      message: "User is not authenticated.",
    };
  }

  try {
    const newComment = await createCommentService(
      currentUser.id,
      postId,
      content,
      parentId
    );

    if (!newComment) {
      return {
        success: false,
        message: "Post ID not valid or Parent ID does not match Post ID.",
      };
    }

    return {
      success: true,
      message: "Comment created successfully!",
      comment: newComment,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};

export const deleteCommentResolver = async (
  _parent: unknown,
  { commentId }: { commentId: number },
  context: { currentUser: { id: number; isAdmin: boolean } | null }
) => {
  const { currentUser } = context;

  if (!currentUser) {
    return {
      success: false,
      message: "User is not authenticated.",
    };
  }

  try {
    const result = await deleteCommentService(
      commentId,
      currentUser.id,
      currentUser.isAdmin
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Failed to delete comment.",
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
