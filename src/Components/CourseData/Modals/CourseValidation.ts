import * as Yup from "yup";

/*
  CSSProperties is the React type for normal inline styles:

    style={labelStyle}
    style={inputStyle}

  This lets TypeScript check that our style objects contain
  valid CSS properties.
*/
import type { CSSProperties } from "react";

/*
  AxiosRequestConfig is the official Axios type for objects like:

    {
      headers: {
        Authorization: "Bearer ..."
      }
    }
*/
import type { AxiosRequestConfig } from "axios";

/*
  Reuse our shared Course type.

  This is useful when creating initial values for the Edit Course form.
*/
import type {
  Course,
} from "../../../types/course";


/* =========================================================
   FORM VALUE TYPE
========================================================= */

/*
  IMPORTANT:

  Although fields such as courseFee and courseDuration
  are numbers in the DATABASE, HTML form inputs initially
  give us strings.

  Example:

    <input type="number" />

  still gives:
    event.target.value === "100"

  not:
    100

  Therefore the Formik form must temporarily allow:

    string | number

  for numeric fields.
*/
export interface CourseFormValues {
  courseName: string;

  courseType: string;

  courseAvailability: string;

  /*
    These values may begin as "" and later contain numbers.
  */
  dailySessionHrs: string | number;

  courseDuration: string | number;

  courseFee: string | number;

  noOfDays: string | number;
}


/* =========================================================
   VALIDATION SCHEMA
========================================================= */

/*
  Yup validates the values before the form is submitted.

  We do not need to manually type every Yup method here;
  Yup already provides its own TypeScript definitions.
*/
export const courseValidationSchema =
  Yup.object().shape({
    courseName: Yup.string()
      .required("Mandatory field!"),

    courseType: Yup.string()
      .required("Mandatory field!"),

    dailySessionHrs: Yup.number()
      .typeError("Must be a number")
      .positive("Must be greater than 0")
      .required("Mandatory field!"),

    courseAvailability: Yup.string()
      .required("Mandatory field!"),

    courseDuration: Yup.number()
      .typeError("Must be a number")
      .positive("Must be greater than 0")
      .required("Mandatory field!"),

    courseFee: Yup.number()
      .typeError("Must be a number")
      .positive("Must be greater than 0")
      .required("Enter Course Fee!"),

    noOfDays: Yup.number()
      .typeError("Must be a number")
      .positive("Must be greater than 0")
      .integer("Must be a whole number")
      .notRequired(),
  });


/* =========================================================
   ADD COURSE INITIAL VALUES
========================================================= */

/*
  Explicitly typing this object as CourseFormValues means
  TypeScript will check that:

    - all required form fields exist
    - property names are correct
    - values have compatible types

  For example, this typo would now fail:

    courseDuraton: ""

  because CourseFormValues expects:
    courseDuration
*/
export const courseInitialValues:
  CourseFormValues = {
  courseName: "",
  courseType: "",
  dailySessionHrs: "",
  courseAvailability: "",
  courseDuration: "",
  courseFee: "",
  noOfDays: "",
};


/* =========================================================
   EDIT COURSE INITIAL VALUES
========================================================= */

/*
  This function receives the Course that the user wants to edit.

  It may temporarily be:
    Course
    null
    undefined

  because a modal may render before a course has been selected.
*/
export const getCourseEditInitialValues = (
  course: Course | null | undefined
): CourseFormValues => {
  return {
    /*
      Text fields fall back to "".
    */
    courseName:
      course?.courseName ?? "",

    courseType:
      course?.courseType ?? "",

    courseAvailability:
      course?.courseAvailability ?? "",

    /*
      Numeric database values can remain numbers.

      If they don't exist yet, use "" so the form input is empty.
    */
    dailySessionHrs:
      course?.dailySessionHrs ?? "",

    courseDuration:
      course?.courseDuration ?? "",

    courseFee:
      course?.courseFee ?? "",

    noOfDays:
      course?.noOfDays ?? "",
  };
};


/* =========================================================
   FORM STYLES
========================================================= */

/*
  CSSProperties ensures these objects are valid React
  inline-style objects.
*/
export const labelStyle:
  CSSProperties = {
  fontWeight: 600,
  fontSize: "12px",
  color: "#475569",
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
};


export const inputStyle:
  CSSProperties = {
  borderRadius: "6px",
  padding: "8px 12px",
  fontSize: "13px",
  border: "1px solid #e2e8f0",
};


export const disabledInputStyle:
  CSSProperties = {
  /*
    Reuse all normal input styles first.
  */
  ...inputStyle,

  backgroundColor: "#f3f4f6",
  color: "#6b7280",
};


/* =========================================================
   NUMBER OF DAYS CALCULATION
========================================================= */

/*
  Formik may give us:

    ""
    "40"
    40

  Therefore both parameters support:
    string | number
*/
export const calculateNoOfDays = (
  courseDuration: string | number,
  dailySessionHrs: string | number
): number | "" => {
  /*
    Convert form values into real numbers.

    Examples:

      Number("40") → 40
      Number("8")  → 8
  */
  const duration =
    Number(courseDuration);

  const dailyHours =
    Number(dailySessionHrs);


  /*
    Reject:
      empty values
      NaN
      zero
      negative hours
  */
  if (
    !courseDuration ||
    !dailySessionHrs ||
    !Number.isFinite(duration) ||
    !Number.isFinite(dailyHours) ||
    dailyHours <= 0
  ) {
    return "";
  }


  /*
    Example:

      courseDuration = 40 hours
      dailySessionHrs = 8 hours

      40 / 8 = 5 days

    Math.ceil handles cases such as:

      41 / 8 = 5.125
      Math.ceil(...) = 6 days
  */
  return Math.ceil(
    duration / dailyHours
  );
};


/* =========================================================
   AXIOS AUTH CONFIG
========================================================= */

/*
  This helper is still used by both:
    ModalAddCourse
    ModalEditCourse

  Later we may refactor these modals to use our existing
  `useAuthConfig()` hook instead.

  For now we preserve the existing behaviour while
  adding proper TypeScript typing.
*/
export const getAuthConfig =
  (): AxiosRequestConfig => {
    /*
      localStorage.getItem() returns:

        string | null
    */
    const token =
      localStorage.getItem("token");


    return {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };
  };