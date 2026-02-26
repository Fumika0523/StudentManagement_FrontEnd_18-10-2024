import * as Yup from "yup";


export const batchInitialValues = {
      batchNumber: "",
      sessionType: "",
      courseName: "",
      sessionDay: "",
      sessionTime: "",
      targetStudent: "",
      location: "",
      courseFee: ""
}

export const formSchema = Yup.object().shape({
  courseName: Yup.string()
    .trim()
    .min(2, "Course name must be at least 2 characters")
    .max(80, "Course name is too long")
    .required("Course name is required"),

  sessionType: Yup.string()
    .required("Session type is required"),

  sessionDay: Yup.string()
    .required("Session day is required"),

  sessionTime: Yup.string()
    .required("Session time is required"),

  targetStudent: Yup.string()
    // .oneOf(["beginner", "intermediate", "advanced", "all"], "Select a valid target")
    .required("Target student is required"),

  location: Yup.string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(120, "Location is too long")
    .required("Location is required"),
});