import * as Yup from "yup";


// ========================================
// TASK DETAIL TYPE
// ========================================

export interface TaskDetailFormValue {
  taskQuestion: string;

  /*
   * A task can currently be assigned to
   * multiple batch numbers.
   */
  batchNumber: string[];

  /*
   * This starts as an empty string in the form,
   * then Yup validates it as a number.
   */
  allocatedDay: string | number;
}


// ========================================
// TASK FORM VALUES
// ========================================

export interface TaskFormValues {
  taskCourseName: string;

  taskDetail: TaskDetailFormValue[];
}


// ========================================
// EMPTY TASK DETAIL
// ========================================

export const emptyDetail:
  TaskDetailFormValue = {
  taskQuestion:
    "",

  batchNumber:
    [],

  allocatedDay:
    "",
};


// ========================================
// INITIAL FORM VALUES
// ========================================

export const taskInitialValues:
  TaskFormValues = {
  taskCourseName:
    "",

  taskDetail: [
    {
      ...emptyDetail,
    },
  ],
};


// ========================================
// VALIDATION SCHEMA
// ========================================

export const TaskSchema =
  Yup.object({
    taskCourseName:
      Yup.string().required(
        "Select Course Name!"
      ),

    taskDetail:
      Yup.array()
        .of(
          Yup.object({
            taskQuestion:
              Yup.string().required(
                "Task question is required"
              ),

            /*
             * Formik may initially hold this as "",
             * but Yup converts/validates it as a number.
             */
            allocatedDay:
              Yup.number()
                .typeError(
                  "Must be a number"
                )
                .min(
                  1,
                  "Min 1 day"
                )
                .required(
                  "Allocated day is required"
                ),

            /*
             * Keep batchNumber in the schema so its
             * shape matches TaskDetailFormValue.
             */
            batchNumber:
              Yup.array()
                .of(
                  Yup.string()
                )
                .defined(),
          })
        )
        .min(
          1,
          "Add at least one task detail"
        )
        .required(),
  });