import * as Yup from "yup";

export const postCreationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(255, "Title must be less than 255 characters"),
  content: Yup.string().required("Content is required"),
});

export const commentSchema = Yup.object({
  content: Yup.string().required("Content is required"),
  PostId: Yup.number()
    .required("PostId is required")
    .integer("PostId should be an integer"),
  ParentId: Yup.number().integer("ParentId should be an integer").optional(),
});
