import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deleteUser = async (userId: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      await axiosInstance.delete(`${url.users}/${userId}/delete`);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Error deleting user.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};

export default useDeleteUser;
