import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FcReading } from "react-icons/fc";
import { Email, Lock } from "@mui/icons-material";

import { url } from "../../Components/utils/constant";
import {
  FieldGroup,
  inputStyle,
  panelStyle,
} from "../../Components/StudentData/Modals/CreateStudent/studentFormStyle";

const studentSignInSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const studentSignInInitialValues = {
  email: "",
  password: "",
};

function StudentSignIn() {
  const navigate = useNavigate();

  const { redirect, batchId } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      redirect: sp.get("redirect"),
      batchId: sp.get("batchId"),
    };
  }, []);

  const signInStudent = async (studentPayload) => {
    try {
      const payload = {
        email: studentPayload.email.trim().toLowerCase(),
        password: studentPayload.password,
      };

      const res = await axios.post(`${url}/signin-student`, payload);
      console.log("res",res.data.student)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.student.role);

      const firstName =
        res.data.student?.firstName ||
        res.data.student?.firstName?.split(" ")?.[0] ||
        payload.email.split("@")[0];

      localStorage.setItem("firstName", firstName);
      localStorage.setItem("studentId", res.data.student?._id );

      toast.success(res.data.message || "Signed in successfully!");

      if (redirect && batchId) {
        window.location.href = `${redirect}?batchId=${batchId}`;
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Student login error:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const formik = useFormik({
    initialValues: studentSignInInitialValues,
    validationSchema: studentSignInSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await signInStudent(values);
    },
  });

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8001/auth/google?role=student";
  };

  return (
    <div className="signInStyle container-fluid min-vh-100 flex-column gap-4">
      <Row className="justify-content-center w-100 gap-3">
          <Col xs={11} sm={10} md={9} lg={6} xl={5}>
            <Form
            className="signinCard px-4 py-3 my-md-0 my-2"
            onSubmit={formik.handleSubmit}
          >
            {/* Header */}
            <Row className="justify-content-center mb-1">
              <h2 className="d-flex align-items-center justify-content-center gap-2">
                <FcReading style={{ fontSize: 42 }} />
                Student Sign In
              </h2>
            </Row>

            {/* Fields */}
            <div style={panelStyle}>
              <Row className="g-3">
                <Col xs={12}>
                  <FieldGroup
                    label="Email"
                    icon={<Email />}
                    required
                    error={formik.touched.email && formik.errors.email}
                  >
                    <Form.Control
                      size="sm"
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="email@example.com"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </Col>

                <Col xs={12}>
                  <FieldGroup
                    label="Password"
                    icon={<Lock />}
                    required
                    error={formik.touched.password && formik.errors.password}
                  >
                    <Form.Control
                      size="sm"
                      type="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="••••••••"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </Col>
              </Row>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="sign-Btn w-100 my-3 fw-bold text-white"
              style={{ fontSize: 18, border: "none" }}
            >
              SIGN IN
            </Button>

            {/* Divider */}
            <div className="d-flex align-items-center mb-3">
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
              <span className="mx-3" style={{ fontSize: 14, color: "#777" }}>
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
            </div>

            {/* Google */}
            <Button
              type="button"
              className="google-btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                backgroundColor: "#fff",
                color: "#444",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 500,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon sx={{ color: "#ea4335", fontSize: 22 }} />
              Sign in with Google
            </Button>
          </Form>
          </Col>
      </Row>
      {/* Footer */}
        <Row className="justify-content-center w-100 gap-3">
            <Col
              xs={11}
              sm={10}
              md={9}
              lg={6}
              xl={5}
              className="signinCard2 px-4 py-2 d-flex justify-content-center flex-row align-items-center gap-1"
            >
              <span className="message">Don&apos;t have an account?</span>
              <Link
                className="link-underline link-underline-opacity-0"
                to="/student-signup"
              >
                Create an account
              </Link>
            </Col>
      </Row>
    </div>
  );
}

export default StudentSignIn;