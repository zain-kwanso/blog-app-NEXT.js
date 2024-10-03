"use client";

import React, { createContext, useState, useEffect } from "react";

import { UserResponse } from "../../@types/user";
import { AuthContextType } from "../../@types/context";

import { getCurrentUser, logout } from "@/actions/auth";
import { signinAction } from "@/actions/auth";

const initialAuthContext: AuthContextType = {
  user: null,
  email: null,
  loading: false,

  signin: async (email, password) => {
    return 200;
  },

  updateProfilePicture: (url: string) => {},
  signout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    setLoading(true);

    try {
      const response = await getCurrentUser();
      console.log(response);

      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Update profile picture function
  const updateProfilePicture = (profilePictureUrl: string) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, profilePictureUrl };
    });
  };

  // Sign in function
  const signin = async (email: string, password: string): Promise<number> => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const response = await signinAction(formData);

      if (response.status) {
        await fetchUser();
        return response.status;
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
    return 200;
  };

  // Sign out function
  const signout = async () => {
    setUser(null);
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        email,

        signin,
        signout,

        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
