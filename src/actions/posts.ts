"use server";

import { validateFormData } from "@/validation/validateData";
import { getCurrentUser } from "./auth";
import { postValidationSchema } from "@/validation/validationSchema";
import {
  createPostService,
  deletePostService,
  updatePostService,
} from "@/services/postService";
import { redirect } from "next/navigation";

// create post server action
export const createPostAction = async (formData: FormData) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Forbidden");
  }

  const validationResponse = await validateFormData(
    postValidationSchema,
    formData
  );
  if (!validationResponse.isValid) {
    throw new Error("Invalid form data");
  }

  const { title, content } = validationResponse.body;

  try {
    const newPost = await createPostService(title, content, currentUser?.id);

    return { data: newPost, status: 200 };
  } catch (error) {
    return {
      error: "Something went wrong, please try again later",
      status: 500,
    };
  }
};

// update post server action
export const updatePostAction = async (postId: number, formData: FormData) => {
  if (isNaN(postId) || postId <= 0) {
    throw new Error("Invalid Post Id");
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Forbidden");
  }

  const validationResponse = await validateFormData(
    postValidationSchema,
    formData
  );
  if (!validationResponse.isValid) {
    throw new Error("Invalid form data");
  }

  const { title, content } = validationResponse.body;

  try {
    await updatePostService(postId, title, content, currentUser.id);
    return { data: "post updated successfully", status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
};

// delete a post server action
export const deletePostAction = async (postId: number) => {
  if (isNaN(postId) || postId <= 0) {
    return {
      error: "Invalid post ID. It must be a positive integer.",
      status: 400,
    };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Forbidden", status: 403 };
  }

  try {
    const result = await deletePostService(
      postId,
      currentUser.id,
      currentUser.isAdmin
    );
    return { data: result, status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const status = [
      "Post not found",
      "Not authorized to delete this post",
    ].includes(errorMessage)
      ? 403
      : 500;
    return { error: errorMessage, status };
  }
};
