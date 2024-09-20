"use client";

import useFetchUsers from "@/hooks/useFetchUsers";
import useDeleteUser from "@/hooks/useDeleteUser";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import withAuth from "@/components/withAuth";

const AdminPanel = () => {
  const { users, error, fetchUsers } = useFetchUsers();
  const { user: currentUser } = useContext(AuthContext);
  const {
    deleteUser,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteUser();

  const handleDeleteUser = async (userId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteUser(userId);
      if (deleteError) {
        toast.error(deleteError);
      } else {
        toast.success("User deleted successfully!");
        fetchUsers();
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 mt-24 mb-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
          Admin Panel - User Data
        </h1>
        <div className="text-center text-red-500 py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-24 mb-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
        Admin Panel - User Data
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                ID
              </th>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Name
              </th>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Email
              </th>

              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                <td className="py-4 px-6">{user.id}</td>
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">
                  {currentUser?.id !== user.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${
                        deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(AdminPanel);
