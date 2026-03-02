import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useMemo } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Components/utils/constant";
import { FcReading } from "react-icons/fc";
import { toast } from "react-toastify";

function StudentSignIn() {
  const navigate = useNavigate();

  // read redirect params (optional)
  const { redirect, batchId } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      redirect: sp.get("redirect"),
      batchId: sp.get("batchId"),
    };
  }, []);

  // ✅ Option A: email + password login
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const postSignInUser = async (loginUser) => {
    try {
      const payload = {
        email: (loginUser.email || "").trim().toLowerCase(),
        password: loginUser.password,
      };

      const res = await axios.post(`${url}/signin`, payload);

      // Save auth info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // show firstName in NavBar (fallbacks included)
      const firstName =
        res.data.user?.firstName ||
        res.data.user?.name?.split(" ")?.[0] ||
        payload.email.split("@")[0];

      localStorage.setItem("firstName", firstName);

      // If your app still expects studentId, keep it (user id)
      localStorage.setItem("userId", res.data.user?._id || "");

      toast.success(res.data.message || "Signed in!");

      // Optional redirect (if you use it)
      if (redirect && batchId) {
        window.location.href = `${redirect}?batchId=${batchId}`;
        return;
      }

      navigate("/dashboard");
    } catch (e) {
      console.error("Student login error:", e);
      if (e.response?.data?.message) toast.error(e.response.data.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: postSignInUser,
  });

  // Google login (unchanged)
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8001/auth/google?role=student";
  };

  return (
    <>
      <div className="signInStyle justify-content-center d-flex container-fluid min-vh-100 align-items-center">
        <div className="row justify-content-center flex-column align-items-center w-100 gap-4">
          <Form
            onSubmit={formik.handleSubmit}
            className="signinCard col-12 col-sm-7 col-md-6 col-lg-4 px-4"
          >
            {/* TITLE */}
            <div className="row">
              <h2
                style={{ fontSize: "30px" }}
                className="d-flex justify-content-center align-items-center"
              >
                <FcReading className="mb-1" style={{ fontSize: "55px" }} />
                Student
              </h2>
            </div>

            {/* Email */}
            <Form.Group className="text-start">
              <Form.Label className="formLabel m-0">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="email@example.com"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger" style={{ fontSize: 12 }}>
                  {formik.errors.email}
                </div>
              ) : null}
            </Form.Group>

            {/* Password */}
            <Form.Group className="text-start">
              <Form.Label className="formLabel m-0">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger" style={{ fontSize: 12 }}>
                  {formik.errors.password}
                </div>
              ) : null}
            </Form.Group>

            {/* Sign In */}
            <div className="row d-flex justify-content-center">
              <Button
                type="submit"
                className="sign-Btn fw-bold my-4"
                style={{ fontSize: "18px", width: "94%" }}
              >
                SIGN IN
              </Button>
            </div>

            {/* Divider */}
            <div className="row mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <div style={{ height: "1px", width: "35%", background: "#ddd" }} />
                <span style={{ margin: "0 12px", fontSize: "14px", color: "#777" }}>
                  OR
                </span>
                <div style={{ height: "1px", width: "35%", background: "#ddd" }} />
              </div>
            </div>

            {/* Google Sign In */}
            <div className="row d-flex justify-content-center">
              <Button
                type="button"
                className="google-btn d-flex align-items-center justify-content-center gap-2"
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  color: "#444",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px 0",
                  fontWeight: "500",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon sx={{ color: "#ea4335", fontSize: 22 }} />
                Sign in with Google
              </Button>
            </div>
          </Form>

          {/* Footer */}
          <div className="signinCard2 col-12 col-sm-7 col-md-6 col-lg-4 d-flex">
            <div className="text-center message">Don't have account? &nbsp;</div>
            <Link
              className="link-underline link-underline-opacity-0 text-center"
              to="/student-signup"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentSignIn;