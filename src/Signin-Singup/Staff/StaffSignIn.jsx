import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Components/utils/constant";
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from "react-toastify";

function StaffSignIn() {
  const navigate = useNavigate();

  // read redirect params once
  const { redirect, batchId } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      redirect: sp.get("redirect"),
      batchId: sp.get("batchId"),
    };
  }, []);

  const goAfterLogin = () => {
    // if you have redirect params (approval page etc.)
    if (redirect && batchId) {
      window.location.href = `${redirect}?batchId=${batchId}`;
      return;
    }
    navigate("/dashboard");
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && (role === "admin" || role === "staff")) {
      goAfterLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Option A: email + password login
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const postSignInUser = async (values) => {
    try {
      const payload = {
        email: (values.email || "").trim().toLowerCase(),
        password: values.password,
      };

      const res = await axios.post(`${url}/signin`, payload);

      // Save auth info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Store a friendly name for NavBar
      const firstName =
        res.data.user?.firstName ||
        res.data.user?.name?.split(" ")?.[0] ||
        payload.email.split("@")[0];

      localStorage.setItem("firstName", firstName);

      // optional
      localStorage.setItem("userId", res.data.user?._id || "");
      localStorage.setItem("email", res.data.user?.email || payload.email);

      toast.success(res.data.message || "Signed in!");
      goAfterLogin();
    } catch (e) {
      console.error("Login Error:", e);
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

  const FieldError = ({ name }) => {
    if (!formik.touched[name] || !formik.errors[name]) return null;
    return (
      <div className="text-danger" style={{ fontSize: 12 }}>
        {formik.errors[name]}
      </div>
    );
  };

  return (
    <div className="signInStyle justify-content-center d-flex container-fluid min-vh-100 align-items-center">
      <div className="d-flex flex-column align-items-center w-100" style={{ gap: 14 }}>
        <Form
          onSubmit={formik.handleSubmit}
          className="signinCard px-4"
          style={{
            width: "100%",
            maxWidth: 480, // ✅ prevents “too big” on medium screens
            borderRadius: 16,
            paddingTop: 16,
            paddingBottom: 18,
          }}
        >
          {/* TITLE */}
          <div className="text-center mb-2">
            <h2
              style={{ fontSize: 28 }}
              className="d-flex justify-content-center align-items-center mb-1"
            >
              <FcVoicePresentation className="mb-1" style={{ fontSize: 52 }} />
              <span className="ms-2">Staff Sign In</span>
            </h2>
          </div>

          {/* Email */}
          <Form.Group className="text-start mt-3">
            <Form.Label className="formLabel m-0">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="email@example.com"
            />
            <FieldError name="email" />
          </Form.Group>

          {/* Password */}
          <Form.Group className="text-start mt-2">
            <Form.Label className="formLabel m-0">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Password"
            />
            <FieldError name="password" />
          </Form.Group>

          {/* Sign In Button */}
          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              className="sign-Btn fw-bold my-4"
              style={{
                fontSize: 16,
                width: "100%",
                outline: "none",
                border: "none",
                borderRadius: 10,
                padding: "10px 0",
              }}
            >
              SIGN IN
            </Button>
          </div>
        </Form>

        {/* Footer */}
        <div
          className="signinCard2 d-flex justify-content-center align-items-center px-4"
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 14,
            padding: "10px 12px",
          }}
        >
          <div className="text-center message">Don't have account?&nbsp;</div>
          <Link className="link-underline link-underline-opacity-0 text-center" to="/staff-signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StaffSignIn;