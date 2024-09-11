import { Comment, User } from "@/database/models/associations";

// Service to create a new comment
export const createCommentService = async (
  userId: number,
  PostId: number,
  content: string,
  ParentId?: number
) => {
  if (!ParentId) {
    return await Comment.create({
      UserId: userId,
      PostId,
      content,
    });
  }

  const parentComment = await Comment.findByPk(ParentId);
  if (parentComment?.PostId === PostId) {
    return await Comment.create({
      UserId: userId,
      ParentId,
      PostId,
      content,
    });
  }

  return null;
};

// Service to delete a comment
export const deleteCommentService = async (
  commentId: number,
  userId: number,
  isAdmin: boolean
) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    return { success: false, error: "Comment not found" };
  }

  if (comment.UserId !== userId && !isAdmin) {
    return { success: false, error: "Unauthorized to delete this comment" };
  }

  await comment.destroy();
  return { success: true, message: "Comment deleted successfully" };
};

export const getPostCommentsService = async (postId: number) => {
  return await Comment.findAll({
    where: {
      PostId: postId,
      ParentId: null, // Fetch only top-level comments
    },
    include: [
      {
        model: Comment,
        as: "replies",
        required: false,
        include: [
          {
            model: User,
            attributes: ["name"], // Include author's name for replies
          },
        ],
      },
      {
        model: User,
        attributes: ["name"], // Include author's name for top-level comments
      },
    ],
    order: [["createdAt", "ASC"]], // Order by creation time
  });
};
