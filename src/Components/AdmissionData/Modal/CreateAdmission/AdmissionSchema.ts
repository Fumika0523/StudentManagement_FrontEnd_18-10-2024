import * as Yup from "yup";

import type {
  AdmissionStatus,
} from "../../../../types/admission";


// ========================================
// ADMISSION FORM VALUES
// ========================================

/*
 * TypeScript:
 * This describes the values managed by Formik
 * inside ModalAddAdmission.
 *
 * admissionFee and admissionYear begin as ""
 * because nothing has been selected yet.
 *
 * After the user selects a course/date,
 * they become numbers.
 */
export interface AdmissionFormValues {
  batchNumber: string;

  courseId: string;

  studentId: string;

  studentName: string;

  courseName: string;

  admissionSource: string;

  admissionFee:
    | number
    | "";

  admissionDate: string;

  admissionYear:
    | number
    | "";

  admissionMonth: string;

  status: AdmissionStatus;
}


// ========================================
// INITIAL FORM VALUES
// ========================================

export const admissionInitialValues:
  AdmissionFormValues = {
  batchNumber: "",

  courseId: "",

  studentId: "",

  studentName: "",

  courseName: "",

  admissionSource: "",

  admissionFee: "",

  admissionDate: "",

  admissionYear: "",

  admissionMonth: "",

  status: "Assigned",
};


// ========================================
// VALIDATION SCHEMA
// ========================================

/*
 * TypeScript:
 * The old file called this `studentSchema`,
 * even though it validates an Admission form.
 *
 * We keep the same export name for now because
 * ModalAddAdmission currently imports:
 *
 *   studentSchema
 *
 * This avoids breaking the existing component
 * before we migrate it to TypeScript next.
 */
export const studentSchema:
  Yup.ObjectSchema<AdmissionFormValues> =
  Yup.object({
    batchNumber:
      Yup.string()
        .required(
          "Please select Batch Number!"
        )
        .defined(),

    courseId:
      Yup.string()
        .required(
          "Mandatory field!"
        )
        .defined(),

    studentId:
      Yup.string()
        .required(
          "Mandatory field!"
        )
        .defined(),

    courseName:
      Yup.string()
        .required(
          "Select Course Name!"
        )
        .defined(),

    studentName:
      Yup.string()
        .required(
          "Please select Student Name!"
        )
        .defined(),

    admissionSource:
      Yup.string()
        .required(
          "Please Select Source"
        )
        .defined(),


    /*
     * admissionFee begins as "".
     *
     * Once a course is selected,
     * ModalAddAdmission sets it to the numeric
     * Course.courseFee value.
     */
    admissionFee:
      Yup.mixed<
        number | ""
      >()
        .defined()
        .test(
          "valid-admission-fee",
          "Fee is required",
          (value) => {
            if (value === "") {
              return false;
            }

            return Number.isFinite(
              Number(value)
            );
          }
        ),


    /*
     * HTML date fields use strings in the format:
     *
     * YYYY-MM-DD
     *
     * so the frontend form value is typed as string.
     */
    admissionDate:
      Yup.string()
        .required(
          "Please select Date!"
        )
        .defined(),


    /*
     * admissionYear starts empty and later becomes
     * a number when admissionDate is selected.
     */
    admissionYear:
      Yup.mixed<
        number | ""
      >()
        .defined()
        .test(
          "valid-admission-year",
          "Mandatory field!",
          (value) => {
            if (value === "") {
              return false;
            }

            return Number.isFinite(
              Number(value)
            );
          }
        ),


    /*
     * admissionMonth is calculated automatically
     * from admissionDate.
     */
    admissionMonth:
      Yup.string()
        .defined(),


    /*
     * New admissions always begin as Assigned.
     *
     * AdmissionStatus also supports "De-assigned"
     * because the Edit Admission feature uses it.
     */
    status:
      Yup.mixed<
        AdmissionStatus
      >()
        .oneOf([
          "Assigned",
          "De-assigned",
        ])
        .defined(),
  });