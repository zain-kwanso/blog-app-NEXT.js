import { Comment, User } from "@/database/models/associations";
import { generatePresignedUrl } from "./s3Service";

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
  // Fetch comments along with user information, including the profileKey
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
            attributes: ["name", "profileKey"], // Fetch the profileKey along with the name
          },
        ],
      },
      {
        model: User,
        attributes: ["name", "profileKey"], // Fetch the profileKey along with the name
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  // Iterate through the comments and generate profilePictureUrls
  const commentsWithProfilePicture = await Promise.all(
    //@ts-ignore
    comments.map(async (comment) => {
      // Check if the main comment has a User and a profileKey
      let profilePictureUrl = null;
      if (comment.User && comment.User.profileKey) {
        profilePictureUrl = await generatePresignedUrl(comment.User.profileKey);
      }

      // Check if the comment has replies and process each reply's user information
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
