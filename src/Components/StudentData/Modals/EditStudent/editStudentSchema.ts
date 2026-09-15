import * as Yup from "yup";

import type {
  StudentFormGender,
} from "../CreateStudent/StudentSchema";


// ========================================
// STUDENT TITLE TYPE
// ========================================

/*
 * TypeScript:
 * These are the exact title values currently
 * supported by the Edit Student dropdown.
 */
export type StudentTitle =
  | ""
  | "Mr"
  | "Ms"
  | "Mrs"
  | "Mx"
  | "Dr"
  | "Prof";


// ========================================
// EDIT STUDENT FORM VALUES
// ========================================

/*
 * This interface represents Formik's Edit Student
 * form values.
 *
 * It is intentionally separate from the complete
 * Student model because:
 *
 * - _id is not edited here
 * - createdAt is not edited here
 * - batch/admission fields are not edited here
 * - password is displayed but not sent to the backend
 */
export interface EditStudentFormValues {
  title: StudentTitle;

  firstName: string;

  lastName: string;

  email: string;

  /*
   * The current Edit Student form keeps this field
   * blank and disabled.
   *
   * It still exists in Formik so we keep it typed.
   */
  password: string;

  phoneNumber: string;

  gender: StudentFormGender;

  /*
   * HTML <input type="date"> stores its value
   * as a YYYY-MM-DD string.
   */
  birthdate: string;

  /*
   * Country stores the two-letter country code,
   * for example:
   *
   * JP
   * GB
   * US
   */
  country: string;

  preferredCourses: string[];
}


// ========================================
// UPDATE PAYLOAD TYPE
// ========================================

/*
 * Password is deliberately removed before
 * updating a Student.
 *
 * Omit<> lets TypeScript describe that payload
 * without creating a second duplicate interface.
 */
export type UpdateStudentPayload =
  Omit<
    EditStudentFormValues,
    "password"
  >;


// ========================================
// VALIDATION SCHEMA
// ========================================

/*
 * We let Yup infer its own schema type here.
 *
 * This is useful because birthdate is stored by
 * Formik as a string but Yup.date() can internally
 * cast it to a Date during validation.
 *
 * Explicitly forcing ObjectSchema<EditStudentFormValues>
 * can create unnecessary string-vs-Date TypeScript
 * conflicts.
 */
export const editStudentSchema =
  Yup.object().shape({
    // ----------------------------------------
    // TITLE
    // ----------------------------------------

    title:
      Yup.string()
        .oneOf([
          "",
          "Mr",
          "Ms",
          "Mrs",
          "Mx",
          "Dr",
          "Prof",
        ]),


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

    /*
     * Preserve the existing schema behaviour.
     *
     * Note:
     * EditStudentData currently keeps password
     * blank and disabled, then removes it before
     * sending the update request.
     *
     * We will handle that carefully when we migrate
     * EditStudentData.tsx next.
     */
   password:
  Yup.string()
    .notRequired(),


    // ----------------------------------------
    // PHONE NUMBER
    // ----------------------------------------

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


// ========================================
// INITIAL VALUES
// ========================================

/*
 * The original JavaScript file exported an empty
 * object here.
 *
 * Keep the export so any existing imports continue
 * to work during migration.
 *
 * EditStudentData builds its real initial values
 * dynamically from the selected Student.
 */
export const editStudentInitialValues:
  Partial<EditStudentFormValues> = {};