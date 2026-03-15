import * as Yup from "yup";

export const studentInitialValues = {
    //  title: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      gender: "Rather not say",
      birthdate: "",
      country: "",
      preferredCourses: [],
      role:"student"
};

export const studentSchema = (mode) => Yup.object().shape({
    // title: Yup.string().oneOf(["", "Mr", "Ms", "Mrs", "Mx", "Dr", "Prof"]),
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9+() \-]*$/, "Invalid phone number")
      .nullable(),
    gender: Yup.string().oneOf(["male", "female", "Rather not say"]).nullable(),
    birthdate: Yup.date().nullable(),
    country: Yup.string().nullable(),
    preferredCourses: Yup.array(),
  });