import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import GoogleIcon from "@mui/icons-material/Google";

const signInSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function SignInForm({ title, icon, onSubmit, signupPath, showGoogle = false, onGoogleSignIn }) {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    onSubmit,
  });

  return (
    <div className="signInStyle container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center gap-3">
      {/* Main card */}
      <Form
        onSubmit={formik.handleSubmit}
        className="signinCard px-4 py-4 w-100"
        style={{ maxWidth: 460, borderRadius: 16 }}
      >
        {/* Title */}
        <h2 className="d-flex justify-content-center align-items-center gap-2 mb-1">
          {icon}
          {title}
        </h2>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="formLabel m-0">Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-4">
          <Form.Label className="formLabel m-0">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit */}
        <Button
          type="submit"
          className="sign-Btn w-100 fw-bold"
          style={{ fontSize: 16, border: "none", borderRadius: 10, padding: "10px 0" }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing in…" : "SIGN IN"}
        </Button>

        {/* Google (optional) */}
        {showGoogle && (
          <>
            <div className="d-flex align-items-center my-3">
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
              <span className="mx-3" style={{ fontSize: 14, color: "#777" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
            </div>
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
              onClick={onGoogleSignIn}
            >
              <GoogleIcon sx={{ color: "#ea4335", fontSize: 22 }} />
              Sign in with Google
            </Button>
          </>
        )}
      </Form>

      {/* Footer card */}
      <div
        className="signinCard2 w-100 d-flex justify-content-center align-items-center gap-1 px-4 py-3"
        style={{ maxWidth: 460, borderRadius: 14 }}
      >
        <span className="message">Don't have an account?</span>
        <Link className="link-underline link-underline-opacity-0" to={signupPath}>
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default SignInForm;