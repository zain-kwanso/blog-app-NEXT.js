import { useState } from "react";

import {
  CommentCreationAttributes,
  CommentResponse,
} from "../../@types/comment";
import { url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";

export const useCreateComment = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const createComment = async (
    content: string,
    postId: number,
    parentId?: number
  ): Promise<CommentResponse> => {
    try {
      const data: CommentCreationAttributes = parentId
        ? { content, PostId: postId, ParentId: parentId }
        : { content, PostId: postId };

      const response = await axiosInstance.post<CommentResponse>(
        url.comments + `/create`,
        data
      );
      setSuccess("Comment created successfully!");
      return response.data;
    } catch (err) {
      setError("Failed to create comment.");
      throw err;
    }
  };

  return { createComment, error, success };
};
