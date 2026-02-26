import * as Yup from "yup";

export const admissionInitialValues = {
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

export const studentSchema = Yup.object().shape({
    batchNumber: Yup.string().required("Please select Batch Number!"),
    courseId: Yup.string().required("Mandatory field!"),
    studentId: Yup.string().required("Mandatory field!"),
    courseName: Yup.string().required("Select Course Name!"),
    studentName: Yup.string().required("Please select Student Name!"),
    admissionSource: Yup.string().required("Please Select Source"),
    admissionFee: Yup.number().required("Fee is required"),
    admissionDate: Yup.date().required("Please select Date!"),
    admissionYear: Yup.number().required("Mandatory field!"),
    admissionMonth: Yup.string(),
    status: Yup.string(),
  });