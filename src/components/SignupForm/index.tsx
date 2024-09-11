"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signupValidationSchema } from "@/validation/validationSchema";

import { useRouter } from "next/navigation"; // Use the Next.js router
import { UserCreationAttributes } from "../../../@types/user";

const SignupForm: React.FC = (): React.JSX.Element => {
  const router = useRouter(); // Use Next.js router for navigation

  const defaultSignupValues: UserCreationAttributes = {
    name: "default",
    email: "default@example.com",
    password: "password123",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreationAttributes>({
    resolver: yupResolver(signupValidationSchema),
    defaultValues: defaultSignupValues,
  });

  const onSubmit: SubmitHandler<UserCreationAttributes> = async (data) => {
    try {
      // Perform signup logic here (API call)
      // Example: await signup(data.name, data.email, data.password);
      toast.success("Signup successful!");
      router.push("/"); // Navigate to home page after successful signup
    } catch (error) {
      toast.error("An error occurred during signup");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password?.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
