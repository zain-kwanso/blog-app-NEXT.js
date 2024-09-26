import { useState } from "react";
import { deleteUserAction } from "@/app/actions/users";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deleteUser = async (userId: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      await deleteUserAction(userId);
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
