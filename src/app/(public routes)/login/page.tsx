import React from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

const LoginPage: React.FC = (): React.JSX.Element => {
  return (
    <div className="flex justify-center items-center h-screen w-full p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <LoginForm />
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
