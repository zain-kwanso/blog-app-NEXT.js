import { useState } from "react";
import { url } from "@/utils/URL";
import { DeleteEditResponse, PostCreationAttributes } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";

const useEditPost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const editPost = async (
    postId: number,
    postData: PostCreationAttributes
  ): Promise<void> => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.put<DeleteEditResponse>(
        `${url.posts}/${postId}/update`,
        postData
      );

      if (response.status === 200) {
        setSuccess("Post updated successfully!");
      } else {
        throw new Error("Failed to update post");
      }
    } catch (err) {
      setError("Failed to update the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { editPost, loading, error, success };
};

export default useEditPost;
