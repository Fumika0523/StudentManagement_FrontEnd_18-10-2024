import * as Yup from "yup";

export const editStudentSchema = Yup.object().shape({
  studentName: Yup.string().required("Mandatory Field!"),
  username: Yup.string().required("Mandatory Field!"),
  email: Yup.string().email("Invalid email").required("Mandatory Field!"),
  phoneNumber: Yup.string().required("Mandatory Field!"),
  gender: Yup.string().required("Mandatory Field!"),
  birthdate: Yup.date(),
});
