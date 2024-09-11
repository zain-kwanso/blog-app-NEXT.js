import * as Yup from "yup";

const emailSchema = Yup.string()
  .email("Please enter a valid email address")
  .required("Email is required");

const passwordSchema = Yup.string()
  .min(5, "Password must be at least 5 characters long")
  .required("Password is required");

const loginValidationSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

const postValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters long")
    .max(3000, "Content must be at most 3000 characters long")
    .required("Content is required"),
});

const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name must be at least 4 characters long")
    .max(20, "Name must be less than 20 characters")
    .required("Name is required"),
  email: emailSchema,
  password: passwordSchema,
});

export { loginValidationSchema, postValidationSchema, signupValidationSchema };
