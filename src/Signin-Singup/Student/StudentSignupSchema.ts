import * as Yup from "yup";


// ========================================
// TASK DETAIL TYPE
// ========================================

/*
 * This object already existed in this file.
 * We give it a type so TypeScript knows the
 * expected structure of each task detail.
 */
export interface EmptyTaskDetail {
  taskQuestion: string;
  batchNumber: string[];
  allocatedDay: string;
}


export const emptyDetail: EmptyTaskDetail = {
  taskQuestion: "",
  batchNumber: [],
  allocatedDay: "",
};


// ========================================
// STUDENT SIGNUP FORM TYPE
// ========================================

export interface StudentSignupValues {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  country: string;
  phoneNumber: string;
  birthdate: string;
  gender: string;
  role: "student";
}


// ========================================
// INITIAL FORM VALUES
// ========================================

export const studentInitialValues: StudentSignupValues = {
  firstName: "",
  lastName: "",
  password: "",
  email: "",
  country: "",
  phoneNumber: "",
  birthdate: "",
  gender: "",
  role: "student",
};


// ========================================
// VALIDATION SCHEMA
// ========================================

/*
 * We keep the existing Yup validation behaviour.
 *
 * The TypeScript form interface above describes the
 * values used by the frontend, while Yup handles
 * runtime validation when the form is submitted.
 */
export const StudentSignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),

  phoneNumber: Yup.string()
    .trim()
    .matches(
      /^[0-9+() \-]*$/,
      "Invalid phone number"
    )
    .nullable(),

  birthdate: Yup.date(),

  gender: Yup.string(),

  password: Yup.string()
    .required("Password is required"),
});