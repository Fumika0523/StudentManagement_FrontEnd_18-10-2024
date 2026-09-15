import * as Yup from "yup";


// ========================================
// STUDENT FORM TYPES
// ========================================

/*
 * TypeScript:
 * The Student creation form does not use the entire
 * backend Student document.
 *
 * For example, fields such as:
 *
 * _id
 * createdAt
 * batchId
 * admissionId
 *
 * do not exist yet when creating a new Student.
 *
 * Therefore we define a separate form type instead
 * of using the full Student interface.
 */

export type StudentFormGender =
  | "male"
  | "female"
  | "Rather not say";


export interface StudentFormValues {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  phoneNumber: string;

  gender: StudentFormGender;

  /*
   * HTML date inputs return strings such as:
   *
   * 2026-09-12
   *
   * so the Formik value remains a string.
   */
  birthdate: string;

  country: string;

  /*
   * preferredCourses contains Course IDs/names
   * selected by the user.
   */
  preferredCourses: string[];

  /*
   * This form is specifically for Student creation,
   * so the role is always "student".
   */
  role: "student";
}


// ========================================
// INITIAL FORM VALUES
// ========================================

export const studentInitialValues:
  StudentFormValues = {
  firstName: "",

  lastName: "",

  email: "",

  password: "",

  phoneNumber: "",

  gender:
    "Rather not say",

  birthdate: "",

  country: "",

  preferredCourses: [],

  role:
    "student",
};


// ========================================
// VALIDATION SCHEMA
// ========================================

/*
 * The old JavaScript function accepted `mode`,
 * although that parameter was not actually used.
 *
 * We keep the function shape for now because Formik
 * already uses:
 *
 * validationSchema: studentSchema
 *
 * `_mode?: unknown` safely accepts whatever Formik
 * provides without introducing `any`.
 */
export const studentSchema = (
  _mode?: unknown
) =>
  Yup.object().shape({
    // ----------------------------------------
    // FIRST NAME
    // ----------------------------------------

    firstName:
      Yup.string()
        .trim()
        .required(
          "First name is required"
        ),


    // ----------------------------------------
    // LAST NAME
    // ----------------------------------------

    lastName:
      Yup.string()
        .trim()
        .required(
          "Last name is required"
        ),


    // ----------------------------------------
    // EMAIL
    // ----------------------------------------

    email:
      Yup.string()
        .trim()
        .email(
          "Invalid email"
        )
        .required(
          "Email is required"
        ),


    // ----------------------------------------
    // PASSWORD
    // ----------------------------------------

    password:
      Yup.string()
        .required(
          "Password is required"
        ),


    // ----------------------------------------
    // PHONE NUMBER
    // ----------------------------------------

    /*
     * Preserve the existing accepted characters:
     *
     * numbers
     * +
     * ()
     * spaces
     * -
     */
    phoneNumber:
      Yup.string()
        .trim()
        .matches(
          /^[0-9+() \-]*$/,
          "Invalid phone number"
        )
        .nullable(),


    // ----------------------------------------
    // GENDER
    // ----------------------------------------

    gender:
      Yup.string()
        .oneOf([
          "male",
          "female",
          "Rather not say",
        ])
        .nullable(),


    // ----------------------------------------
    // BIRTHDATE
    // ----------------------------------------

    /*
     * Keep the original Yup date validation.
     *
     * The Formik form itself stores the HTML input
     * value as a string, while Yup can cast it into
     * a Date during validation.
     */
    birthdate:
      Yup.date()
        .nullable(),


    // ----------------------------------------
    // COUNTRY
    // ----------------------------------------

    country:
      Yup.string()
        .nullable(),


    // ----------------------------------------
    // PREFERRED COURSES
    // ----------------------------------------

    preferredCourses:
      Yup.array()
        .of(
          Yup.string()
        ),
  });