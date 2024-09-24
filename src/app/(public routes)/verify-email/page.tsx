"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import useCustomNavigation from "@/hooks/useCustomNavigation";
import axios from "axios";
import { backend_url, url } from "@/utils/URL";
import axiosInstance from "@/utils/axiosInstance";
// import { verifyEmailRequest } from "@/services/emailService";

export const verifyEmailRequest = async (token: string) => {
  try {
    const res = await axiosInstance.get(url.verify_email, {
      params: { token },
    });

    if (res.status === 200) {
      return res.data.message;
    } else {
      throw new Error(res.data.error || "Verification failed");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { navigateToLoginPage } = useCustomNavigation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setMessage("Invalid or missing token.");
      toast.error("Invalid or missing token.");
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const message = await verifyEmailRequest(token);
      setMessage(message);
      toast.success(message);
      setLoading(false);
      setTimeout(() => {
        navigateToLoginPage();
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || "Failed to verify email.");
        toast.error(error.message || "Failed to verify email.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.966 7.966 0 014 12H0c0 2.623 1.006 5 2.646 6.646l1.354-1.355z"
              ></path>
            </svg>
            <p className="text-gray-600 mt-4">
              Verifying your email, please wait...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              {message}
            </h1>
            {message.includes("successfully") && (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                onClick={() => navigateToLoginPage()}
              >
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
