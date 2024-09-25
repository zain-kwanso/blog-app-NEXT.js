"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import useCustomNavigation from "@/hooks/useCustomNavigation";
import { UserLoginAttributes } from "../../../@types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "@/validation/validationSchema";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

const LoginForm: React.FC = (): React.JSX.Element => {
  const { navigateToHomePage } = useCustomNavigation();
  const { signin } = useContext(AuthContext);

  const defaultLoginValues: UserLoginAttributes = {
    email: "default@example.com",
    password: "password123",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginAttributes>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: defaultLoginValues,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<UserLoginAttributes> = async (data) => {
    try {
      const status = await signin(data.email, data.password);

      if (status === 200) {
        toast.success("Login Successful.");
        navigateToHomePage();
      } else if (status === 401) {
        toast.warning("Please verify your email first.");
      } else {
        toast.error("Invalid Credentials!");
      }
    } catch (error) {
      toast.error("Invalid Credentials!");
    }
  };

  return (
    <form
      className="w-full max-w-3xl self-center p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="email">
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
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="password">
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
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {isSubmitting ? "Signing In..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
