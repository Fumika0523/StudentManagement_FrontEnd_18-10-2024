import * as Yup from "yup";

export const emptyDetail = { taskQuestion: "", batchNumber: [], allocatedDay: "" };

export const studentInitialValues = {
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    country: "",
    phoneNumber: "",
    birthdate: "",
    gender: "",
    role: "student",
  }

export const StudentSignupSchema = Yup.object().shape({
   firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
    country: Yup.string().trim().required("Country is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9+() \-]*$/, "Invalid phone number")
    .nullable(),
  birthdate: Yup.date(),
  gender: Yup.string(),
  password: Yup.string().required("Password is required"),
});