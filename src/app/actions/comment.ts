"use server";

import { createCommentService } from "@/services/commentService";
import { getUserAction } from "@/app/actions/auth";
import { validateFormData } from "@/validation/validateData";
import { commentSchema } from "@/validation/validationSchema";

export const createCommentAction = async (
  content: string,
  postId: number,
  parentId?: number
) => {
  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return { error: "Forbidden", status: 401 };
  }

  try {
    const comment = await createCommentService(
      sessionUser.id,
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
