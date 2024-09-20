import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  posts: string;
}

interface UseFetchUsers {
  users: User[];
  loading: boolean;
  error: string;
  fetchUsers: () => Promise<void>;
}

const useFetchUsers = (): UseFetchUsers => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError("");
    setUsers([]);

    try {
      const response = await axiosInstance.get(url.users);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
};

export default useFetchUsers;
