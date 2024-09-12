import { useState } from "react";
import { DeleteEditResponse } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";

const useDeleteComment = () => {
  const [error, setError] = useState<string>("");

  const deleteComment = async (commentId: number): Promise<void> => {
    try {
      const response = await axiosInstance.delete<DeleteEditResponse>(
        `${url.comments}/${commentId}/delete`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete comment");
      }
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error:", err);
    }
  };

  return { deleteComment, error };
};

export default useDeleteComment;
