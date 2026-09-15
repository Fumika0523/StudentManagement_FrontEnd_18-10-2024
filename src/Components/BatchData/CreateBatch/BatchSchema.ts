import * as Yup from "yup";


// ========================================
// BATCH FORM VALUES TYPE
// ========================================

/*
 * TypeScript:
 * This represents the values used specifically by the
 * "Add Batch" form.
 *
 * Notice that these are not exactly the same as our
 * final Batch API type.
 *
 * For example, form fields begin as empty strings while
 * the user is filling them in.
 */
export interface BatchFormValues {
  batchNumber: string;

  sessionType: string;

  courseName: string;

  sessionDay: string;

  sessionTime: string;

  targetStudent: string;

  /*
   * TypeScript:
   * courseFee can initially be empty, but after selecting
   * a course it normally becomes the numeric course fee.
   */
  courseFee: number | "";

  /*
   * This field was missing from the original
   * batchInitialValues object even though ModalAddBatch
   * uses formik.values.startDate.
   *
   * Adding it here makes the form structure consistent
   * with the actual UI.
   */
  startDate: string;
}


// ========================================
// INITIAL FORM VALUES
// ========================================

export const batchInitialValues: BatchFormValues = {
  batchNumber: "",

  sessionType: "",

  courseName: "",

  sessionDay: "",

  sessionTime: "",

  targetStudent: "",

  courseFee: "",

  // TypeScript:
  // Required because the Add Batch form contains
  // a start-date input.
  startDate: "",
};


// ========================================
// YUP VALIDATION SCHEMA
// ========================================

/*
 * TypeScript:
 * Yup.ObjectSchema<BatchFormValues> makes sure the
 * validation schema corresponds to the form values
 * defined above.
 */
export const formSchema: Yup.ObjectSchema<BatchFormValues> =
  Yup.object({
    batchNumber: Yup.string()
      .defined(),

    courseName: Yup.string()
      .trim()
      .min(
        2,
        "Course name must be at least 2 characters"
      )
      .max(
        80,
        "Course name is too long"
      )
      .required(
        "Course name is required"
      ),

    sessionType: Yup.string()
      .required(
        "Session type is required"
      ),

    sessionDay: Yup.string()
      .required(
        "Session day is required"
      ),

    sessionTime: Yup.string()
      .required(
        "Session time is required"
      ),

    targetStudent: Yup.string()
      .required(
        "Target student is required"
      ),

    /*
     * courseFee is automatically filled when the user
     * selects a course, so it does not currently need
     * its own validation message.
     */
    courseFee: Yup.mixed<number | "">()
      .defined(),

    /*
     * The UI already treats startDate as a required
     * form field, so the schema should validate it too.
     */
    startDate: Yup.string()
      .required(
        "Start date is required"
      ),
  });