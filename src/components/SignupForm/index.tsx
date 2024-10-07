"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { signupValidationSchema } from "@/validation/validationSchema";
import { UserCreationAttributes } from "../../../@types/user";
import { signupAction } from "@/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/utils/mutations";

const SignupForm: React.FC = (): React.JSX.Element => {
  const defaultSignupValues: UserCreationAttributes = {
    name: "",
    email: "",
    password: "",
  };
  const [signup] = useMutation(SIGNUP_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreationAttributes>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: defaultSignupValues,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<UserCreationAttributes> = async (data) => {
    try {
      const response = await signup({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      const result = response.data.signup;

      if (result?.status === 200) {
        toast.success("Verification Email Sent Successfully.");
      } else if (result?.status === 409) {
        toast.error("User already exists. Please log in.");
      } else {
        toast.error(
          result?.message || "An error occurred. Please try again later."
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error("Signup error:", err);
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
