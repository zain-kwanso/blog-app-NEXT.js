"use server";

import { validateFormData } from "@/validation/validateData";
import { getUserAction } from "./auth";
import { postValidationSchema } from "@/validation/validationSchema";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostsByUser,
  getPostService,
  updatePost,
} from "@/services/postService";
import { getPostCommentsService } from "@/services/commentService";

// create post server action
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

// update post server action
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

// fetch a single post server action
export const fetchPostAction = async (postId: number) => {
  if (isNaN(postId) || postId <= 0) {
    return {
      error: "Invalid post ID. It must be a positive integer.",
      status: 400,
    };
  }

  try {
    const post = await getPostService(postId);
    return { data: post, status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage === "Post not found" ? 404 : 500;
    return { error: errorMessage, status };
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

  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return { error: "Forbidden", status: 403 };
  }

  try {
    const result = await deletePost(
      postId,
      sessionUser.id,
      sessionUser.isAdmin
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

// fetch comments for a post server action
export const fetchPostCommentsAction = async (postId: number) => {
  if (isNaN(postId) || postId <= 0) {
    return { error: "Invalid post ID", status: 400 };
  }

  try {
    const comments = await getPostCommentsService(postId);
    return { data: comments, status: 200 };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage, status: 500 };
  }
};
