import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Form from "react-bootstrap/Form";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import { url } from "../../Components/utils/constant";
import axios from "axios";
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();

  const formSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    username: Yup.string().trim().required("Username is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9+() \-]*$/, "Invalid phone number")
      .nullable(),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      birthdate: "",
      gender: "",
      role: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber?.trim() || undefined, 
      };

      try {
        const res = await axios.post(`${url}/signup`, payload);
        if (res.status === 200) {
          toast.success("User account is registered successfully!");
          navigate("/staff-signin");
        }
      } catch (error) {
        console.log("Sign up Error:", error.message);
        toast.error("Sign up failed");
      }
    },
  });

  return (
    <>
      <div className="signInStyle container-fluid d-flex justify-content-center min-vh-100 align-items-center">
        <div className="row justify-content-center align-items-center d-flex flex-column gap-4 w-100">
          <Form
            className="signupCard col-10 col-sm-10 col-md-6 col-lg-5 col-xl-5 col-xxl-4 px-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="row">
              <h2 className="d-flex justify-content-center align-items-center pb-2 fs-2">
                <FcVoicePresentation style={{ fontSize: "55px" }} /> Staff Sign Up
              </h2>
            </div>

            {/* Row 1: First/Last */}
            <div className="row">
              <Form.Group className="col-lg-6 col-sm-6 col-md-6 mb-1">
                <Form.Label className="formLabel m-0">First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="col-lg-6 col-sm-6 col-md-6 mb-1">
                <Form.Label className="formLabel m-0">Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </Form.Group>
            </div>

            {/* Row 2: Username/Email */}
            <div className="row">
              <Form.Group className="col-lg-6 col-sm-6 col-md-6 mb-1">
                <Form.Label className="formLabel m-0">Username</Form.Label>
                <Form.Control
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.username}
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="col-md-6 col-lg-6 col-sm-6">
                <Form.Label className="formLabel m-0">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </Form.Group>
            </div>

            {/* Row 3: Gender/Birthdate */}
            <div className="row align-items-center d-flex">
              <div className="col-lg-6 col-md-6 col-sm-6 d-flex flex-column justify-content-start mb-1">
                <div className="formLabel mb-1">Gender</div>
                <div className="d-flex flex-row">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={formik.handleChange}
                    />
                    Male
                  </div>
                  <div className="form-check ms-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={formik.handleChange}
                    />
                    Female
                  </div>
                </div>
              </div>

              <Form.Group className="col-lg-6 col-sm-6 col-md-6 mb-1">
                <Form.Label className="formLabel m-0">Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={formik.values.birthdate}
                  onChange={formik.handleChange}
                />
              </Form.Group>
            </div>

            {/* Row 4: Phone/Role */}
            <div className="row mb-2">
              <Form.Group className="col-lg-6 col-sm-6 col-md-6 mb-1">
                <Form.Label className="formLabel m-0">Phone (optional)</Form.Label>
                <Form.Control
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.phoneNumber}
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="col-lg-6 col-sm-6 col-md-6">
                <Form.Label className="formLabel m-0">Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="supportTeam">Support Team</option>
                  <option value="testingTeam">Testing Team</option>
                  <option value="guest">Guest</option>
                  <option value="student">Student</option>
                </Form.Select>
                {formik.touched.role && formik.errors.role ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.role}
                  </div>
                ) : null}
              </Form.Group>
            </div>

            {/* Row 5: Password */}
            <div className="row mb-2">
              <Form.Group className="col-lg-12">
                <Form.Label className="formLabel m-0">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-danger" style={{ fontSize: 12 }}>
                    {formik.errors.password}
                  </div>
                ) : null}
              </Form.Group>
            </div>

            <div className="row p-1">
              <div className="text-center">
                <Button
                  type="submit"
                  variant="outline-*"
                  className="sign-Btn my-3 fw-bold text-white"
                  style={{ fontSize: "18px", width: "100%", outline: "none", border: "none" }}
                >
                  SIGN UP
                </Button>
              </div>
            </div>

            <div className="row text-center mb-1">
              <div className="message">Or Sign Up Using</div>
            </div>

            <div className="row">
              <div className="gap-2 mt-2 d-flex" style={{ justifyContent: "center" }}>
                <FacebookIcon className="socialIcons" sx={{ color: "navy" }} />
                <LinkedInIcon className="socialIcons" sx={{ color: "#0077B5" }} />
                <GitHubIcon className="socialIcons" />
                <GoogleIcon sx={{ color: "#ea4335" }} className="socialIcons" />
              </div>
            </div>
          </Form>

          <div className="signinCard2 col-11 col-sm-10 col-md-6 col-lg-5 col-xl-5 col-xxl-4 px-4 d-flex justify-content flex-row">
            <div className="text-center message">Or already have an account? &nbsp;</div>
            <Link className="link-underline link-underline-opacity-0 text-center" to="/staff-signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
