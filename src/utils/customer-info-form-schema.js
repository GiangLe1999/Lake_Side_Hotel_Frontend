import * as yup from "yup";

export const customerInfoFormSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .trim(),
  tel: yup
    .string()
    .required("Phone number is required")
    .matches(/^[\d\s\-+()]+$/, "Invalid phone number format")
    .test(
      "min-digits",
      "Phone number must be at least 10 digits",
      (value) => value && value.replace(/\D/g, "").length >= 10
    ),
  confirmationCode: yup
    .string()
    .required("Confirmation code is required")
    .matches(/^\d{6}$/, "Confirmation code must be exactly 6 digits"),
});
