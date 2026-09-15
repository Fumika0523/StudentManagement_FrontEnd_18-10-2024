import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import {
  useFormik,
} from "formik";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import GoogleIcon from "@mui/icons-material/Google";

import {
  Cake,
  Email,
  Lock,
  Person,
  Phone,
  PublicOutlined,
  WcOutlined,
} from "@mui/icons-material";

import {
  FcReading,
} from "react-icons/fc";

import {
  toast,
} from "react-toastify";

import {
  FieldGroup,
  inputStyle,
  panelStyle,
} from "../../Components/StudentData/Modals/CreateStudent/studentFormStyle";

import useCountryCode from "../../Components/StudentData/Modals/CreateStudent/CountryCode";

import {
  StudentSignupSchema,
  studentInitialValues,
} from "./StudentSignupSchema";

import type {
  StudentSignupValues,
} from "./StudentSignupSchema";

import {
  url,
} from "../../Components/utils/constant";


// ========================================
// API ERROR TYPE
// ========================================

interface ApiErrorResponse {
  message?: string;
}


// ========================================
// GENDER OPTIONS
// ========================================

const GENDERS = [
  "male",
  "female",
  "Rather not say",
] as const;


// ========================================
// STUDENT SIGNUP COMPONENT
// ========================================

function SignUp() {
  const navigate =
    useNavigate();


  /*
   * useCountryCode is already migrated to TypeScript.
   *
   * It returns:
   * - countries: CountryOption[]
   * - countryLoading: boolean
   */
  const {
    countries,
    countryLoading,
  } =
    useCountryCode();


  // ========================================
  // CREATE STUDENT ACCOUNT
  // ========================================

  /*
   * StudentSignupValues comes from
   * StudentSignupSchema.ts.
   *
   * Reusing that type keeps our initial values,
   * Formik form and API payload consistent.
   */
  const signUpStudent =
    async (
      studentPayload:
        StudentSignupValues
    ): Promise<void> => {
      try {
        const response =
          await axios.post(
            `${url}/signup-student`,
            studentPayload
          );


        if (
          response.status === 200 ||
          response.status === 201
        ) {
          toast.success(
            "Student Account created!"
          );


          navigate(
            "/student-signin"
          );
        }
      } catch (
        error: unknown
      ) {
        /*
         * Catch values are unknown in TypeScript.
         * Narrow to an Axios error before reading
         * response data.
         */
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          console.error(
            "Student signup error:",
            error.response?.data
          );

          return;
        }


        console.error(
          "Student signup error:",
          error
        );
      }
    };


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<StudentSignupValues>({
      initialValues:
        studentInitialValues,

      validationSchema:
        StudentSignupSchema,

      validateOnMount:
        true,

      validateOnChange:
        true,

      validateOnBlur:
        true,

      onSubmit:
        async (
          values
        ): Promise<void> => {
          await signUpStudent(
            values
          );
        },
    });


  // ========================================
  // GOOGLE SIGNUP
  // ========================================

  const handleGoogleSignUp =
    (): void => {
      /*
       * Keep the existing Google signup route
       * unchanged during the TypeScript migration.
       */
      window.location.href =
        "http://localhost:8001/auth/google";
    };


  // ========================================
  // UI
  // ========================================

  return (
    <div className="signInStyle container-fluid min-vh-100">
      <Row className="justify-content-center w-100 gap-3">
        <Col
          xs={11}
          sm={10}
          md={9}
          lg={8}
          xl={6}
        >
          <Form
            className="signupCard px-4 py-3 my-md-0 my-2"
            onSubmit={
              formik.handleSubmit
            }
          >
            {/* ========================================
                HEADER
            ======================================== */}

            <Row className="justify-content-center mb-1">
              <h2 className="d-flex align-items-center justify-content-center gap-2">
                <FcReading
                  style={{
                    fontSize:
                      42,
                  }}
                />

                Student Sign Up
              </h2>
            </Row>


            {/* ========================================
                FORM FIELDS
            ======================================== */}

            <div
              style={
                panelStyle
              }
            >
              <Row className="gt-3">
                {/* First Name */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="First Name"
                    icon={
                      <Person />
                    }
                    required
                    error={
                      formik.touched.firstName &&
                      formik.errors.firstName
                    }
                  >
                    <Form.Control
                      size="sm"
                      name="firstName"
                      value={
                        formik.values.firstName
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      placeholder="First name"
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Last Name */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Last Name"
                    icon={
                      <Person />
                    }
                    required
                    error={
                      formik.touched.lastName &&
                      formik.errors.lastName
                    }
                  >
                    <Form.Control
                      size="sm"
                      name="lastName"
                      value={
                        formik.values.lastName
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      placeholder="Last name"
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Email */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Email"
                    icon={
                      <Email />
                    }
                    required
                    error={
                      formik.touched.email &&
                      formik.errors.email
                    }
                  >
                    <Form.Control
                      size="sm"
                      type="email"
                      name="email"
                      value={
                        formik.values.email
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      placeholder="email@example.com"
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Password */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Password"
                    icon={
                      <Lock />
                    }
                    required
                    error={
                      formik.touched.password &&
                      formik.errors.password
                    }
                  >
                    <Form.Control
                      size="sm"
                      type="password"
                      name="password"
                      value={
                        formik.values.password
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      placeholder="••••••••"
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Phone */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Phone"
                    icon={
                      <Phone />
                    }
                    error={
                      formik.touched.phoneNumber &&
                      formik.errors.phoneNumber
                    }
                  >
                    <Form.Control
                      size="sm"
                      name="phoneNumber"
                      value={
                        formik.values.phoneNumber
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      placeholder="+81 90-0000-0000"
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Country */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Country"
                    icon={
                      <PublicOutlined />
                    }
                    required
                    error={
                      formik.touched.country &&
                      formik.errors.country
                    }
                  >
                    <Form.Select
                      size="sm"
                      name="country"
                      value={
                        formik.values.country
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      disabled={
                        countryLoading
                      }
                      style={
                        inputStyle
                      }
                    >
                      <option value="">
                        {countryLoading
                          ? "Loading countries…"
                          : "Select country"}
                      </option>


                      {countries.map(
                        (
                          country
                        ) => (
                          <option
                            key={
                              country.code
                            }
                            value={
                              country.code
                            }
                          >
                            {country.name} ({country.code})
                          </option>
                        )
                      )}
                    </Form.Select>
                  </FieldGroup>
                </Col>


                {/* Birthdate */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Birthdate"
                    icon={
                      <Cake />
                    }
                    error={
                      formik.touched.birthdate &&
                      formik.errors.birthdate
                    }
                  >
                    <Form.Control
                      size="sm"
                      type="date"
                      name="birthdate"
                      value={
                        formik.values.birthdate
                      }
                      onChange={
                        formik.handleChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      style={
                        inputStyle
                      }
                    />
                  </FieldGroup>
                </Col>


                {/* Gender */}

                <Col
                  xs={12}
                  md={6}
                >
                  <FieldGroup
                    label="Gender"
                    icon={
                      <WcOutlined />
                    }
                    error={
                      formik.touched.gender &&
                      formik.errors.gender
                    }
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        gap:
                          8,

                        flexWrap:
                          "wrap",
                      }}
                    >
                      {GENDERS.map(
                        (
                          gender
                        ) => {
                          const checked =
                            formik.values.gender ===
                            gender;


                          return (
                            <label
                              key={
                                gender
                              }
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  6,

                                cursor:
                                  "pointer",

                                padding:
                                  "6px 10px",

                                borderRadius:
                                  999,

                                border:
                                  `1px solid ${
                                    checked
                                      ? "#93c5fd"
                                      : "#e2e8f0"
                                  }`,

                                background:
                                  checked
                                    ? "#eff6ff"
                                    : "#fff",

                                color:
                                  checked
                                    ? "#1d4ed8"
                                    : "#334155",

                                fontSize:
                                  12,

                                fontWeight:
                                  600,

                                userSelect:
                                  "none",
                              }}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value={
                                  gender
                                }
                                checked={
                                  checked
                                }
                                onChange={
                                  formik.handleChange
                                }
                                style={{
                                  accentColor:
                                    "#2563eb",
                                }}
                              />

                              {gender}
                            </label>
                          );
                        }
                      )}
                    </div>
                  </FieldGroup>
                </Col>
              </Row>
            </div>


            {/* ========================================
                SUBMIT
            ======================================== */}

            <Button
              type="submit"
              className="sign-Btn w-100 my-3 fw-bold text-white"
              style={{
                fontSize:
                  18,

                border:
                  "none",
              }}
            >
              SIGN UP
            </Button>


            {/* ========================================
                DIVIDER
            ======================================== */}

            <div className="d-flex align-items-center mb-3">
              <div
                style={{
                  flex:
                    1,

                  height:
                    1,

                  background:
                    "#ddd",
                }}
              />

              <span
                className="mx-3"
                style={{
                  fontSize:
                    14,

                  color:
                    "#777",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex:
                    1,

                  height:
                    1,

                  background:
                    "#ddd",
                }}
              />
            </div>


            {/* ========================================
                GOOGLE SIGNUP
            ======================================== */}

            <Button
              type="button"
              className="google-btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                backgroundColor:
                  "#fff",

                color:
                  "#444",

                border:
                  "1px solid #ddd",

                borderRadius:
                  8,

                padding:
                  "10px 0",

                fontWeight:
                  500,

                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.08)",
              }}
              onClick={
                handleGoogleSignUp
              }
            >
              <GoogleIcon
                sx={{
                  color:
                    "#ea4335",

                  fontSize:
                    22,
                }}
              />

              Sign up with Google
            </Button>
          </Form>
        </Col>


        {/* ========================================
            SIGN-IN LINK
        ======================================== */}

        <Col
          xs={11}
          sm={10}
          md={9}
          lg={8}
          xl={6}
          className="signinCard2 px-4 py-2 d-flex justify-content-center flex-row align-items-center gap-1"
        >
          <span className="message">
            Or already have an account?
          </span>

          <Link
            className="link-underline link-underline-opacity-0"
            to="/student-signin"
          >
            Sign in
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default SignUp;