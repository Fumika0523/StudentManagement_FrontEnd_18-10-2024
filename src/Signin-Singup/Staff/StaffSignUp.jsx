import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Components/utils/constant";
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from "react-toastify";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Person,
  Email,
  Phone,
  Lock,
  Cake,
  PublicOutlined,
  WcOutlined,
  WorkOutlined,
} from "@mui/icons-material";
import {
  FieldGroup,
  inputStyle,
  panelStyle,
} from "../../Components/StudentData/Modals/CreateStudent/studentFormStyle";

const GENDERS = ["male", "female", "Rather not say"];

const formSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9+() \-]*$/, "Invalid phone number")
    .nullable(),
  password: Yup.string().required("Password is required"),
  role: Yup.string().required("Role is required"),
});

function SignUp() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    const loadCountries = async () => {
      setCountryLoading(true);
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        const list = (res.data || [])
          .map((c) => ({ code: (c.cca2 || "").toUpperCase(), name: c?.name?.common || "" }))
          .filter((c) => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (alive) setCountries(list);
      } catch {
        if (alive)
          setCountries([
            { code: "JP", name: "Japan" },
            { code: "GB", name: "United Kingdom" },
            { code: "US", name: "United States" },
            { code: "CA", name: "Canada" },
            { code: "AU", name: "Australia" },
            { code: "DE", name: "Germany" },
            { code: "FR", name: "France" },
          ]);
      } finally {
        if (alive) setCountryLoading(false);
      }
    };
    loadCountries();
    return () => { alive = false; };
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      birthdate: "",
      country: "",
      role: "",
      password: "",
    },
    validationSchema: formSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phoneNumber: values.phoneNumber?.trim() || undefined,
        gender: values.gender || undefined,
        birthdate: values.birthdate || undefined,
        country: values.country || undefined,
        role: values.role,
        password: values.password,
      };
      try {
        const res = await axios.post(`${url}/signup`, payload);
        if (res.status === 200 || res.status === 201) {
          toast.success("User account is registered successfully!");
          navigate("/staff-signin");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Sign up failed");
      }
    },
  });

  const handleGoogleSignUp = () => {
    window.location.href = "http://localhost:8001/auth/google";
  };

  return (
    <div className="signInStyle container-fluid min-vh-100">
      <Row className="justify-content-center w-100 gap-3">
        <Col xs={11} sm={10} md={9} lg={8} xl={6}>
          <Form
            className="signupCard px-4 py-3 my-md-0 my-2"
            onSubmit={formik.handleSubmit}
          >
            {/* Header */}
            <Row className="justify-content-center mb-1">
              <h2 className="d-flex align-items-center justify-content-center gap-2">
                <FcVoicePresentation style={{ fontSize: 42 }} />
                Staff Sign Up
              </h2>
            </Row>

            {/* Fields */}
            <div style={panelStyle}>
              <Row className="g-3">

                {/* First Name */}
                <Col xs={12} md={6}>
                  <FieldGroup label="First Name" icon={<Person />} required error={formik.touched.firstName && formik.errors.firstName}>
                    <Form.Control size="sm" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="First name" style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Last Name */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Last Name" icon={<Person />} required error={formik.touched.lastName && formik.errors.lastName}>
                    <Form.Control size="sm" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Last name" style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Email */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Email" icon={<Email />} required error={formik.touched.email && formik.errors.email}>
                    <Form.Control size="sm" type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="email@example.com" style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Password */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Password" icon={<Lock />} required error={formik.touched.password && formik.errors.password}>
                    <Form.Control size="sm" type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="••••••••" style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Phone */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Phone" icon={<Phone />} error={formik.touched.phoneNumber && formik.errors.phoneNumber}>
                    <Form.Control size="sm" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="+81 90-0000-0000" style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Role */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Role" icon={<WorkOutlined />} required error={formik.touched.role && formik.errors.role}>
                    <Form.Select size="sm" name="role" value={formik.values.role} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle}>
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="supportTeam">Support Team</option>
                      <option value="testingTeam">Testing Team</option>
                      <option value="user">User</option>
                      <option value="guest">Guest</option>
                    </Form.Select>
                  </FieldGroup>
                </Col>

                {/* Country */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Country" icon={<PublicOutlined />} error={formik.touched.country && formik.errors.country}>
                    <Form.Select size="sm" name="country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={countryLoading} style={inputStyle}>
                      <option value="">{countryLoading ? "Loading countries…" : "Select country"}</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                      ))}
                    </Form.Select>
                  </FieldGroup>
                </Col>

                {/* Birthdate */}
                <Col xs={12} md={6}>
                  <FieldGroup label="Birthdate" icon={<Cake />} error={formik.touched.birthdate && formik.errors.birthdate}>
                    <Form.Control size="sm" type="date" name="birthdate" value={formik.values.birthdate} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle} />
                  </FieldGroup>
                </Col>

                {/* Gender */}
                <Col xs={12}>
                  <FieldGroup label="Gender" icon={<WcOutlined />} error={formik.touched.gender && formik.errors.gender}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {GENDERS.map((g) => {
                        const checked = formik.values.gender === g;
                        return (
                          <label key={g} style={{
                            display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                            padding: "6px 10px", borderRadius: 999,
                            border: `1px solid ${checked ? "#93c5fd" : "#e2e8f0"}`,
                            background: checked ? "#eff6ff" : "#fff",
                            color: checked ? "#1d4ed8" : "#334155",
                            fontSize: 12, fontWeight: 600, userSelect: "none",
                          }}>
                            <input type="radio" name="gender" value={g} checked={checked} onChange={formik.handleChange} style={{ accentColor: "#2563eb" }} />
                            {g}
                          </label>
                        );
                      })}
                    </div>
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
              SIGN UP
            </Button>

            {/* Divider */}
            <div className="d-flex align-items-center mb-3">
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
              <span className="mx-3" style={{ fontSize: 14, color: "#777" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#ddd" }} />
            </div>

            {/* Google */}
            <Button
              type="button"
              className="google-btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                backgroundColor: "#fff", color: "#444", border: "1px solid #ddd",
                borderRadius: 8, padding: "10px 0", fontWeight: 500,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
              onClick={handleGoogleSignUp}
            >
              <GoogleIcon sx={{ color: "#ea4335", fontSize: 22 }} />
              Sign up with Google
            </Button>

          </Form>
        </Col>

        {/* Sign-in link */}
        <Col
          xs={11} sm={10} md={9} lg={8} xl={6}
          className="signinCard2 px-4 py-2 d-flex justify-content-center flex-row align-items-center gap-1"
        >
          <span className="message">Or already have an account?</span>
          <Link className="link-underline link-underline-opacity-0" to="/staff-signin">Sign in</Link>
        </Col>
      </Row>
    </div>
  );
}

export default SignUp;