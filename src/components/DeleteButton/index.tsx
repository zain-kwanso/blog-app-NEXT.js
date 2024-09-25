"use client";

import { toast } from "react-toastify";
import useDeleteUser from "@/hooks/useDeleteUser";

interface DeleteButtonProps {
  userId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ userId }) => {
  const { loading, error, deleteUser } = useDeleteUser();

  const handleDelete = async () => {
    try {
      deleteUser(userId);
      if (!loading && error === "") {
        toast.success("user deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteButton;
