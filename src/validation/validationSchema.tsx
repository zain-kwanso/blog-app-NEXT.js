import { z } from "zod";

// Email validation schema
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .nonempty("Email is required");

// Password validation schema
const passwordSchema = z
  .string()
  .min(5, "Password must be at least 5 characters long")
  .nonempty("Password is required");

// Login validation schema
const loginValidationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Post validation schema
const postValidationSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long")
    .nonempty("Title is required"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    .max(3000, "Content must be at most 3000 characters long")
    .nonempty("Content is required"),
});

// Signup validation schema
const signupValidationSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(20, "Name must be less than 20 characters")
    .nonempty("Name is required"),
  email: emailSchema,
  password: passwordSchema,
});

//comment validation schema
export const commentSchema = z.object({
  content: z.string().nonempty({ message: "Content is required" }),
  PostId: z
    .number({ invalid_type_error: "PostId should be a number" })
    .int({ message: "PostId should be an integer" })
    .refine((value) => value > 0, { message: "PostId is required" }),
  ParentId: z
    .number({ invalid_type_error: "ParentId should be a number" })
    .int({ message: "ParentId should be an integer" })
    .optional(),
});

export { loginValidationSchema, postValidationSchema, signupValidationSchema };
