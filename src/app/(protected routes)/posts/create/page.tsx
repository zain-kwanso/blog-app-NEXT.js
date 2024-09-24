"use client"; // This ensures that this component works on the client side

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { postValidationSchema } from "@/validation/validationSchema";
import useCreatePost from "@/hooks/useCreatePost";
import { PostFormData } from "../../../../../@types/post";
import useCustomNavigation from "@/hooks/useCustomNavigation";

const CreatePostPage: React.FC = () => {
  const { createPost } = useCreatePost();

  const { navigateToPreviewPostPage } = useCustomNavigation();

  const defaultPostValues: PostFormData = {
    title: "default title",
    content: "default content",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<PostFormData>({
    resolver: yupResolver(postValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultPostValues,
  });

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    clearErrors();

    try {
      const post = await createPost(data);
      toast.success("Post created successfully!");
      navigateToPreviewPostPage(post?.id);
    } catch (error) {
      toast.error("An error occurred during post creation");
    }
  };

  return (
    <div className="pt-16 px-2 py-2 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl border w-full">
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-3"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={`w-full p-4 border outline-purple-500 rounded-lg ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium mb-3"
            >
              Content
            </label>
            <textarea
              id="content"
              {...register("content")}
              className={`w-full px-3 py-2 border outline-purple-500 rounded-lg ${
                errors.content ? "border-red-500" : ""
              }`}
              rows={10}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-end font-medium">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-500 text-white py-2 px-4 rounded-lg"
            >
              {isSubmitting ? "Creating Post..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
