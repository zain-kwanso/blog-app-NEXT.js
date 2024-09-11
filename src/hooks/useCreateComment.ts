import { useState } from "react";
import axios from "axios";
import {
  CommentCreationAttributes,
  CommentResponse,
} from "../../@types/comment";
import { backend_url, url } from "@/utils/URL";

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

      const response = await axios.post<CommentResponse>(
        backend_url + url.comments + `/create`,
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
