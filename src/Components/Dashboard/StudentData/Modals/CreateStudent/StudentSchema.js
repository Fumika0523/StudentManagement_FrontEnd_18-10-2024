import * as Yup from "yup";

export const studentInitialValues = {
  studentName: "",
  username: "",
  password: "",
  email: "",
  phoneNumber: "",
  gender: "",
  birthdate: "",
  preferredCourses: [], //  make this array (better for checkbox)
};

export const studentSchema = Yup.object().shape({
  studentName: Yup.string()
    .trim()
    .min(2, "Student name must be at least 2 characters")
    .max(60, "Student name is too long")
    .required("Student name is required"),

  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      "Username can use letters, numbers, dot, underscore, hyphen"
    )
    .required("Username is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .matches(/[a-z]/, "Password must include a lowercase letter")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .matches(/[^a-zA-Z0-9]/, "Password must include a symbol")
    .required("Password is required"),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Enter a valid email")
    .max(254, "Email is too long")
    .required("Email is required"),

  // accepts digits + optional +, spaces, hyphens, parentheses
  phoneNumber: Yup.string()
    .trim()
    .matches(/^\+?[0-9()\s-]{8,20}$/, "Enter a valid phone number")
    .required("Phone number is required"),

  gender: Yup.string()
    .oneOf(["male", "female"], "Select Male or Female")
    .required("Gender is required"),

  birthdate: Yup.date()
    .typeError("Birthdate is required")
    .max(new Date(), "Birthdate cannot be in the future")
    .min(new Date(1900, 0, 1), "Birthdate looks too old")
  ,

  preferredCourses: Yup.array()
    .min(1, "Select at least 1 course")
    .required("Mandatory Field!"),
});
