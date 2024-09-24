"use client";

import React, { createContext, useState, useEffect } from "react";
import { setToken, removeToken } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { UserResponse } from "../../@types/user";
import { AuthContextType } from "../../@types/context";
import { url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { getUserAction } from "@/app/actions/auth";

const initialAuthContext: AuthContextType = {
  user: null,
  email: null,
  loading: false,
  signup: async (name, email, password) => {
    return true;
  },
  signin: async (email, password) => {
    return true;
  },
  verifyOtp: async (email, otp) => {
    return true;
  },
  updateProfilePicture: (url: string) => {},
  signout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchUser = async () => {
    setLoading(true);

    try {
      const response = await getUserAction();

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

  // verify-otp function
  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await axiosInstance.post(url.verify_OTP, {
        email,
        otp,
      });

      setToken(response.data.token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error("OTP error:", error);
      throw error;
    }
  };

  // Sign up function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post(url.signup, {
        name,
        email,
        password,
      });

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 409) {
          throw new Error("User already exists. Please log in.");
        } else if (status === 400) {
          throw new Error("Invalid input. Please check your form.");
        } else {
          throw new Error(
            error.response.data.error || "An error occurred during signup."
          );
        }
      } else {
        throw new Error("An error occurred. Please try again later.");
      }
    }
  };
  // Sign in function
  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.post(url.signin, {
        email,
        password,
      });

      if (response.data.token) {
        setEmail(email);
        setToken(response.data.token);
        await fetchUser();
        return true;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          return false;
        }
      }

      console.error("Sign-in error:", error);
      throw error;
    }

    return false;
  };

  // Sign out function
  const signout = async () => {
    await axios.post("/api/auth/logout");

    setUser(null);
    removeToken();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        email,
        signup,
        signin,
        signout,
        verifyOtp,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
