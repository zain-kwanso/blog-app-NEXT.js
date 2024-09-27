"use server";

import {
  createCommentService,
  deleteCommentService,
} from "@/services/commentService";
import { getCurrentUser } from "@/app/actions/auth";

// create comment server action
export const createCommentAction = async (
  content: string,
  postId: number,
  parentId?: number
) => {
  //current user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Forbidden", status: 401 };
  }

  try {
    const comment = await createCommentService(
      currentUser.id,
      postId,
      content,
      parentId
    );

    if (!comment) {
      return {
        error: "PostId not valid or ParentId does not match PostId",
        status: 400,
      };
    }

    return { data: comment, status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage, status: 500 };
  }
};

// delete comment server actions
export const deleteCommentAction = async (commentId: number) => {
  if (isNaN(commentId) || commentId <= 0) {
    return { error: "Invalid comment ID", status: 400 };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Forbidden", status: 403 };
  }

  try {
    const result = await deleteCommentService(
      commentId,
      currentUser.id,
      currentUser.isAdmin
    );

    if (!result.success) {
      return { error: result.error, status: 403 };
    }

    return { message: result.message, status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage, status: 500 };
  }
};
