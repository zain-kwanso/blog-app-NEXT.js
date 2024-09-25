"use server";

import { validateFormData } from "@/validation/validateData";
import { getUserAction } from "./auth";
import { postValidationSchema } from "@/validation/validationSchema";
import { createPost, updatePost } from "@/services/postService";

export const createPostAction = async (formData: FormData) => {
  const sessionUser = await getUserAction();
  if (!sessionUser) {
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
    const newPost = await createPost(title, content, sessionUser?.id);
    return { data: newPost, status: 200 };
  } catch (error) {
    return {
      error: "Something went wrong, please try again later",
      status: 500,
    };
  }
};

export const updatePostAction = async (postId: number, formData: FormData) => {
  if (isNaN(postId) || postId <= 0) {
    throw new Error("Invalid Post Id");
  }

  const sessionUser = await getUserAction();
  if (!sessionUser) {
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
    await updatePost(postId, title, content, sessionUser.id);
    return { data: "post updated successfully", status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
};
