"use client";

import React, { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { User, UserResponse } from "../../@types/user";
import { AuthContextType } from "../../@types/context";
import { url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";

const initialAuthContext: AuthContextType = {
  user: null,
  loading: false,
  signup: async (name, email, password) => {
    return true;
  },
  signin: async (email, password) => {
    return true;
  },
  signout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchUser = async () => {
    setLoading(true);
    const token = getToken();
    if (token) {
      try {
        const response = await axiosInstance.get<User>(url.me);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Sign up function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post(url.signup, {
        name,
        email,
        password,
      });
      setToken(response.data.token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(url.signin, {
        email,
        password,
      });
      setToken(response.data.token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  // Sign out function
  const signout = () => {
    setUser(null);
    removeToken();
    router.push("/login"); // Redirect to login page after signing out
  };

  return (
    <AuthContext.Provider value={{ loading, user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
