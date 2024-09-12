"use client";

import { useState } from "react";
import axios from "axios";
import { PostFormData, PostResponse } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";

interface UseCreatePost {
  createPost: (data: PostFormData) => Promise<PostResponse>;
  loading: boolean;
  error: string;
  success: string;
}

const useCreatePost = (): UseCreatePost => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const createPost = async (data: PostFormData): Promise<PostResponse> => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post<PostResponse>(
        `${url.posts}/create`,
        data
      );
      setSuccess("Post created successfully!");
      return response.data;
    } catch (err) {
      setError("Failed to create post.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error, success };
};

export default useCreatePost;
