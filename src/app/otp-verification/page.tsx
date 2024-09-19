"use client";

import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/authContext";
import useCustomNavigation from "@/hooks/useCustomNavigation";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";
import withNoAuth from "@/components/withNoAuth";

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const { verifyOtp, email } = useContext(AuthContext);
  const { navigateToHomePage, navigateToLoginPage } = useCustomNavigation();

  useEffect(() => {
    sendOTP();
  }, [email]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResendOTP(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await verifyOtp(email!, otp);
      toast.success("Verification Successful.");
      navigateToHomePage();
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };
  const sendOTP = async () => {
    try {
      await axiosInstance.post(url.send_OTP, { email });
      toast.success("OTP sent to your email!");
      setTimer(60);
      setCanResendOTP(false);
    } catch (error) {
      toast.error("Failed to send OTP!");
      navigateToLoginPage();
    }
  };

  // Function to handle OTP resend
  const handleResendOTP = async () => {
    try {
      sendOTP();
    } catch (error) {
      toast.error("Failed to resend OTP!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
              maxLength={6}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {canResendOTP ? (
            <button
              onClick={handleResendOTP}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">Resend OTP in {timer} seconds</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withNoAuth(OTPPage);
