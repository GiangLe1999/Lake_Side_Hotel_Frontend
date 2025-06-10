import * as yup from "yup";

export const reviewSchema = yup.object({
  title: yup
    .string()
    .required("Title of review is required")
    .min(2, "Title of review must be at least 2 characters")
    .max(100, "Title of review cannot exceed 100 characters"),
  rating: yup
    .number()
    .required("Please select a rating")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});
