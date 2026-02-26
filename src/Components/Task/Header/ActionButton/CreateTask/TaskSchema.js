import * as Yup from "yup";

export const emptyDetail = { taskQuestion: "", batchNumber: [], allocatedDay: "" };

export const taskInitialValues = {
  taskCourseName: "",
  taskDetail: [{ ...emptyDetail }],
};

export const TaskSchema = Yup.object().shape({
  taskCourseName: Yup.string().required("Select Course Name!"),
  taskDetail: Yup.array()
    .of(
      Yup.object().shape({
        taskQuestion: Yup.string().required("Task question is required"),
        batchNumber: Yup.array()
          .of(Yup.string())
          .min(1, "At least one batch is required"),
        allocatedDay: Yup.number()
          .typeError("Must be a number")
          .min(1, "Min 1 day")
          .required("Allocated day is required"),
      })
    )
    .min(1, "Add at least one task detail"),
});