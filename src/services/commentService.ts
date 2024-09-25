import { Comment, User } from "@/database/models/associations";
import { generatePresignedUrl } from "./s3Service";

// Service to create a new comment
export const createCommentService = async (
  userId: number,
  postId: number,
  content: string,
  parentId?: number
) => {
  if (!parentId) {
    return await Comment.create({
      UserId: userId,
      PostId: postId,
      content,
    });
  }

  const parentComment = await Comment.findByPk(parentId);
  if (parentComment?.PostId === postId) {
    return await Comment.create({
      UserId: userId,
      ParentId: parentId,
      PostId: postId,
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
  const comments = await Comment.findAll({
    where: {
      PostId: postId,
      ParentId: null,
    },
    include: [
      {
        model: Comment,
        as: "replies",
        required: false,
        include: [
          {
            model: User,
            attributes: ["name", "profileKey"],
          },
        ],
      },
      {
        model: User,
        attributes: ["name", "profileKey"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  const commentsWithProfilePicture = await Promise.all(
    //@ts-ignore
    comments.map(async (comment) => {
      let profilePictureUrl = null;
      if (comment.User && comment.User.profileKey) {
        profilePictureUrl = await generatePresignedUrl(comment.User.profileKey);
      }

      const repliesWithProfilePicture = comment.replies
        ? await Promise.all(
            //@ts-ignore
            comment.replies.map(async (reply) => {
              let replyProfilePictureUrl = null;
              if (reply.User && reply.User.profileKey) {
                replyProfilePictureUrl = await generatePresignedUrl(
                  reply.User.profileKey
                );
              }
              return {
                ...reply.toJSON(),
                User: {
                  ...reply.User?.toJSON(),
                  profilePictureUrl: replyProfilePictureUrl,
                },
              };
            })
          )
        : [];

      // Return the comment with the user's profilePictureUrl and replies
      return {
        ...comment.toJSON(),
        User: {
          ...comment.User?.toJSON(),
          profilePictureUrl,
        },
        replies: repliesWithProfilePicture,
      };
    })
  );

  return commentsWithProfilePicture;
};
