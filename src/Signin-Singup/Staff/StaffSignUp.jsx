import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Components/utils/constant";
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from "react-toastify";

// social icons (UI only)
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

function SignUp() {
  const navigate = useNavigate();

  // ----------------------------
  // Country dropdown (API fetch)
  // ----------------------------
  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadCountries = async () => {
      setCountryLoading(true);
      try {
        // REST Countries (no key)
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2");
        const list = (res.data || [])
          .map((c) => ({
            code: (c.cca2 || "").toUpperCase(),
            name: c?.name?.common || "",
          }))
          .filter((c) => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        if (alive) setCountries(list);
      } catch (e) {
        // fallback: minimal common list
        if (alive) {
          setCountries([
            { code: "JP", name: "Japan" },
            { code: "GB", name: "United Kingdom" },
            { code: "US", name: "United States" },
            { code: "CA", name: "Canada" },
            { code: "AU", name: "Australia" },
            { code: "DE", name: "Germany" },
            { code: "FR", name: "France" },
          ]);
        }
      } finally {
        if (alive) setCountryLoading(false);
      }
    };

    loadCountries();
    return () => {
      alive = false;
    };
  }, []);

  // Option A: Email + Password login (no username)
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

  const formik = useFormik({
    initialValues: {
      title: "",
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
    onSubmit: async (values) => {
      const payload = {
        title: values.title || "",
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phoneNumber: values.phoneNumber?.trim() || undefined,
        gender: values.gender || undefined,
        birthdate: values.birthdate || undefined,
        country: values.country || undefined, // ISO2 code
        role: values.role,
        password: values.password,
      };

      try {
        const res = await axios.post(`${url}/signup`, payload);
        if (res.status === 200) {
          toast.success("User account is registered successfully!");
          navigate("/staff-signin");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Sign up failed");
      }
    },
  });

  const FieldError = ({ name }) => {
    if (!formik.touched[name] || !formik.errors[name]) return null;
    return (
      <div className="text-danger" style={{ fontSize: 12 }}>
        {formik.errors[name]}
      </div>
    );
  };

  // ----------------------------
  // Layout sizing (fix md too big)
  // ----------------------------
  // Use a centered wrapper and cap width so md/lg doesn't look massive.
  const cardStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: 520,
      borderRadius: 16,
      padding: "10px 20px",
    }),
    []
  );



  return (
    <div className="signInStyle container-fluid d-flex justify-content-center min-vh-100 align-items-center">
      <div className="d-flex flex-column align-items-center " style={{ gap: 14 }}>
        <Form
          className="signupCard"
          style={cardStyle}
          onSubmit={formik.handleSubmit}
        >
          {/* Title */}
          <div >
            <h3 className="d-flex justify-content-center align-items-center m-0 p-0">
              <FcVoicePresentation style={{ fontSize: 40 }} />{" "}
              <span className="ms-2">Staff Sign Up</span>
            </h3>
          </div>

          {/* Row: Title / Country */}
          <div className="row  ">
            <Form.Group className="col-12 col-md-5">
              <Form.Label className="formLabel m-0">Title</Form.Label>
              <Form.Select name="title" value={formik.values.title} onChange={formik.handleChange}>
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Mx">Mx</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-12 col-md-7">
              <Form.Label className="formLabel m-0">Country</Form.Label>
              <Form.Select
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                disabled={countryLoading}
              >
                <option value="">
                  {countryLoading ? "Loading countries..." : "Select country"}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {/* Row: First / Last */}
          <div className="row  ">
            <Form.Group className="col-12 col-md-6">
              <Form.Label className="formLabel m-0">First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="First name"
              />
              <FieldError name="firstName" />
            </Form.Group>

            <Form.Group className="col-12 col-md-6">
              <Form.Label className="formLabel m-0">Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Last name"
              />
              <FieldError name="lastName" />
            </Form.Group>
          </div>

          {/* Email (full width) */}
          <div className="row ">
            <Form.Group className="col-12">
              <Form.Label className="formLabel m-0">Email Address</Form.Label>
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
          </div>

          {/* Phone / Role */}
          <div className="row  ">
            <Form.Group className="col-12 col-md-6">
              <Form.Label className="formLabel m-0">Phone (optional)</Form.Label>
              <Form.Control
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="+81..."
              />
              <FieldError name="phoneNumber" />
            </Form.Group>

            <Form.Group className="col-12 col-md-6">
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
                <option value="manager">Manager</option>
                <option value="supportTeam">Support Team</option>
                <option value="testingTeam">Testing Team</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </Form.Select>
              <FieldError name="role" />
            </Form.Group>
          </div>

          {/* Password */}
          <div className="row ">
            <Form.Group className="col-12">
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
          </div>

          {/* Submit */}
          <div className="mt-3">
            <Button
              type="submit"
              className="sign-Btn fw-bold text-white"
              style={{
                width: "100%",
                border: "none",
                fontSize: 16,
                padding: "10px 0",
                borderRadius: 10,
              }}
            >
              SIGN UP
            </Button>
          </div>
        </Form>

        {/* Footer */}
        <div
          className="signinCard2 d-flex justify-content-center align-items-center px-4"
          style={{
            width: "100%",
            maxWidth: 520, // ✅ match form width
            borderRadius: 14,
            padding: "10px 12px",
          }}
        >
          <div className="text-center message">Already have an account?&nbsp;</div>
          <Link className="link-underline link-underline-opacity-0 text-center" to="/staff-signin">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;