"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { postValidationSchema } from "@/validation/validationSchema";
import useEditPost from "@/hooks/useEditPost";
import useFetchPost from "@/hooks/useFetchPost";
import { PostFormData } from "../../../../../../@types/post";
import useCustomNavigation from "@/hooks/useCustomNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePost } from "@/services/postService";
import { updatePostAction } from "@/app/actions/posts";

const EditPostPage = ({ params }: { params: { id: string } }) => {
  const { editPost } = useEditPost();
  const { fetchPost, post } = useFetchPost();
  const { navigateToPreviewPostPage } = useCustomNavigation();
  const postId = parseInt(params.id, 10);

  const defaultPostValues: PostFormData = {
    title: "default title",
    content: "default content",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    resolver: zodResolver(postValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultPostValues,
  });

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      setValue("title", post?.title || "");
      setValue("content", post?.content || "");
    }
  }, [post]);

  const onSubmit = async (data: PostFormData) => {
    clearErrors();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);

    try {
      const response = await updatePostAction(postId, formData);
      navigateToPreviewPostPage(postId);
      if (response.status === 200) {
        toast.success("Post updated successfully!");
      }
    } catch (error) {
      toast.error("An error occurred during post update");
    }
  };

  return (
    <div className="pt-16 py-2 px-2 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl border w-full">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-3">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              className={`w-full p-4 border rounded-lg ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title?.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-3">
              Content
            </label>
            <textarea
              {...register("content")}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              rows={10}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content?.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-end font-medium">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-500 text-white py-2 px-4 rounded-lg"
            >
              {isSubmitting ? "Updating Post..." : "Upate Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
