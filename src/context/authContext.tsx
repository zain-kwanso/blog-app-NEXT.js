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
    const token = getToken();
    if (token) {
      try {
        const response = await axiosInstance.get<UserResponse>(url.me);
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
      setEmail(email);

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
      setEmail(email);
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
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ loading, user, email, signup, signin, signout, verifyOtp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
