import * as Yup from "yup";

export const studentInitialValues = {
  studentName: "",
  username: "",
  password: "",
  email: "",
  phoneNumber: "",
  gender: "",
  birthdate: "",
  preferredCourses: [], //  make this array (better for checkbox)
};

export const studentSchema = Yup.object().shape({
  studentName: Yup.string().required("Mandatory Field!"),
  username: Yup.string().required("Mandatory Field!"),
  password: Yup.string().required("Mandatory Field!"),
  email: Yup.string().email("Invalid email").required("Mandatory Field!"),
  phoneNumber: Yup.string().required("Mandatory Field!"), //  string is safer than number for phone
  gender: Yup.string().required("Mandatory Field!"),
  birthdate: Yup.date().required("Mandatory Field!"),
  preferredCourses: Yup.array()
    .min(1, "Select at least 1 course")
    .required("Mandatory Field!"),
});
