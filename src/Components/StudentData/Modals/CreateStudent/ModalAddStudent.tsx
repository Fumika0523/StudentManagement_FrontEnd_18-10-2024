import {
  useCallback,
  useEffect,
  useMemo,
} from "react";

import type {
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import {
  Row,
  Col,
} from "react-bootstrap";

import {
  useFormik,
} from "formik";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import {
  useNavigate,
} from "react-router-dom";

import {
  studentSchema,
  studentInitialValues,
} from "./StudentSchema";

import type {
  StudentFormGender,
  StudentFormValues,
} from "./StudentSchema";

import useCountryCode from "./CountryCode";

import {
  FieldGroup,
  Section,
  inputStyle,
  panelStyle,
} from "./studentFormStyle";

import ModalHeaderBlock from "../../../Common/ModalHeaderBlock";
import ModalFooterBlock from "../../../Common/ModalFooterBlock";

import {
  url,
} from "../../../utils/constant";

import {
  PersonAdd,
  Person,
  Email,
  Phone,
  Lock,
  Cake,
  School,
  PublicOutlined,
  WcOutlined,
} from "@mui/icons-material";


// ========================================
// SHARED TYPES
// ========================================

import type {
  Student,
} from "../../../../types/student";

import type {
  Course,
} from "../../../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalAddStudentProps {
  // Controls whether the Add Student modal is visible.
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;


  /*
   * Used to refresh the Student table after
   * a student is created.
   */
  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;


  /*
   * Courses are supplied by the parent Student page
   * and displayed as selectable course chips.
   */
  courseData: Course[];
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface StudentListResponse {
  studentData: Student[];
}


/*
 * The signup route may return additional data,
 * but this component does not currently depend
 * on any specific response fields.
 */
interface CreateStudentResponse {
  message?: string;
  student?: Student;
}


// ========================================
// ERROR RESPONSE
// ========================================

interface ApiErrorResponse {
  message?: string;
}


// ========================================
// GENDER OPTIONS
// ========================================

/*
 * TypeScript:
 * Using StudentFormGender[] prevents accidental
 * values that are not supported by our form type.
 */
const GENDER_OPTIONS:
  StudentFormGender[] = [
    "male",
    "female",
    "Rather not say",
  ];


// ========================================
// BOOTSTRAP MODAL STYLE
// ========================================

/*
 * Bootstrap uses a custom CSS variable.
 *
 * React's CSSProperties type does not know
 * custom properties automatically, so we extend it.
 */
const modalStyle:
  CSSProperties & {
    "--bs-modal-border-radius": string;
  } = {
  "--bs-modal-border-radius":
    "16px",
};


// ========================================
// COMPONENT
// ========================================

const ModalAddStudent = ({
  show,
  setShow,
  setStudentData,
  courseData,
}: ModalAddStudentProps) => {
  // ========================================
  // NAVIGATION
  // ========================================

  const navigate =
    useNavigate();


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * TypeScript:
   * Explicitly type the Axios config and memoize it
   * so it remains stable between renders.
   */
  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [token]
    );


  // ========================================
  // COUNTRY OPTIONS
  // ========================================

  /*
   * useCountryCode now returns:
   *
   * countries: CountryOption[]
   * countryLoading: boolean
   */
  const {
    countries,
    countryLoading,
  } =
    useCountryCode();


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setShow(false);

      navigate(
        "/studentdata"
      );
    };


  // ========================================
  // FETCH STUDENTS
  // ========================================

  /*
   * The old JSX fetched /all-student but only
   * logged the result.
   *
   * Since this component already receives
   * setStudentData, we now use the response to
   * refresh the actual parent Student table.
   */
  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<StudentListResponse>(
              `${url}/all-student`,
              config
            );


          setStudentData(
            response.data.studentData
          );
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Error loading students:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error loading students:",
            error
          );
        }
      },
      [
        config,
        setStudentData,
      ]
    );


  // ========================================
  // ADD STUDENT
  // ========================================

  const addStudent =
    async (
      addedStudent:
        StudentFormValues
    ): Promise<void> => {
      try {
        await axios.post<CreateStudentResponse>(
          `${url}/signup-student`,
          addedStudent,
          config
        );


        /*
         * Refresh the Student table immediately
         * after successful creation.
         */
        await getStudentData();


        toast.success(
          "New Student is added!"
        );


        /*
         * Preserve the short delay from
         * the original implementation.
         */
        setTimeout(() => {
          handleClose();
        }, 500);
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript:
         * catch values are unknown, so narrow Axios
         * errors before reading response.data.
         */
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          console.error(
            "Error adding Student:",
            error.response?.data ??
              error.message
          );


          toast.error(
            error.response
              ?.data
              ?.message ??
              "Failed to add student."
          );

          return;
        }


        console.error(
          "Error adding Student:",
          error
        );


        toast.error(
          "Failed to add student."
        );
      }
    };


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<StudentFormValues>({
      initialValues:
        studentInitialValues,

      /*
       * StudentSchema.ts still exports this as
       * a function, matching the original code.
       */
      validationSchema:
        studentSchema,

      onSubmit: async (
        values
      ): Promise<void> => {
        await addStudent(
          values
        );
      },
    });


  /*
   * Short alias retained from the original file
   * so the form JSX stays easy to read.
   */
  const F =
    formik;


  // ========================================
  // INITIAL STUDENT REFRESH
  // ========================================

  useEffect(() => {
    /*
     * Preserve the existing behaviour of loading
     * students when this component opens.
     */
    void getStudentData();
  }, [
    getStudentData,
  ]);


  // ========================================
  // TOGGLE PREFERRED COURSE
  // ========================================

  const toggleCourse = (
    courseName: string
  ): void => {
    const current =
      F.values.preferredCourses;


    /*
     * If the course is already selected,
     * remove it.
     *
     * Otherwise add it.
     */
    const next =
      current.includes(
        courseName
      )
        ? current.filter(
            (
              currentCourse
            ) =>
              currentCourse !==
              courseName
          )
        : [
            ...current,
            courseName,
          ];


    /*
     * void tells TypeScript that we intentionally
     * do not await Formik's Promise return value.
     */
    void F.setFieldValue(
      "preferredCourses",
      next,
      true
    );


    void F.setFieldTouched(
      "preferredCourses",
      true,
      false
    );
  };


  return (
    <Modal
      show={show}
      onHide={
        handleClose
      }
      size="lg"
      centered
      style={
        modalStyle
      }
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <ModalHeaderBlock
        title="Add New Student"
        icon={
          <PersonAdd />
        }
      />


      <Form
        onSubmit={
          F.handleSubmit
        }
      >
        <Modal.Body
          style={{
            padding:
              "16px 18px",

            backgroundColor:
              "#f1f5f9",
          }}
        >
          <div
            style={
              panelStyle
            }
          >
            {/* ========================================
                NAME / GENDER / EMAIL
            ======================================== */}

            <Row className="g-1">
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
                    F.touched.firstName &&
                    F.errors.firstName
                  }
                >
                  <Form.Control
                    size="sm"
                    name="firstName"
                    value={
                      F.values.firstName
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    placeholder="e.g. John"
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
                    F.touched.lastName &&
                    F.errors.lastName
                  }
                >
                  <Form.Control
                    size="sm"
                    name="lastName"
                    value={
                      F.values.lastName
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    placeholder="e.g. Doe"
                    style={
                      inputStyle
                    }
                  />
                </FieldGroup>
              </Col>


              {/* ========================================
                  GENDER
              ======================================== */}

              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Gender"
                  icon={
                    <WcOutlined />
                  }
                >
                  <div
                    style={{
                      display:
                        "flex",

                      gap:
                        10,

                      flexWrap:
                        "wrap",
                    }}
                  >
                    {GENDER_OPTIONS.map(
                      (
                        gender
                      ) => {
                        const checked =
                          F.values.gender ===
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
                                8,

                              cursor:
                                "pointer",

                              padding:
                                "8px 12px",

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
                                13,

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
                                F.handleChange
                              }
                              style={{
                                accentColor:
                                  "#2563eb",
                              }}
                            />


                            {gender ===
                            "Rather not say"
                              ? "Rather not say"
                              : gender
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase() +
                                gender.slice(
                                  1
                                )}
                          </label>
                        );
                      }
                    )}
                  </div>
                </FieldGroup>
              </Col>


              {/* ========================================
                  EMAIL
              ======================================== */}

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
                    F.touched.email &&
                    F.errors.email
                  }
                >
                  <Form.Control
                    size="sm"
                    type="email"
                    name="email"
                    value={
                      F.values.email
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    placeholder="email@example.com"
                    style={
                      inputStyle
                    }
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                PASSWORD / PHONE / BIRTHDATE / COUNTRY
            ======================================== */}

            <Row className="g-1">
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
                    F.touched.password &&
                    F.errors.password
                  }
                >
                  <Form.Control
                    size="sm"
                    type="password"
                    name="password"
                    value={
                      F.values.password
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    placeholder="••••••••"
                    style={
                      inputStyle
                    }
                  />
                </FieldGroup>
              </Col>


              {/* ========================================
                  PHONE
              ======================================== */}

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
                    F.touched.phoneNumber &&
                    F.errors.phoneNumber
                  }
                >
                  <Form.Control
                    size="sm"
                    name="phoneNumber"
                    value={
                      F.values.phoneNumber
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    placeholder="+81 90-0000-0000"
                    style={
                      inputStyle
                    }
                  />
                </FieldGroup>
              </Col>


              {/* ========================================
                  BIRTHDATE
              ======================================== */}

              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Birthdate"
                  icon={
                    <Cake />
                  }
                >
                  <Form.Control
                    size="sm"
                    type="date"
                    name="birthdate"
                    value={
                      F.values.birthdate
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
                    }
                    style={
                      inputStyle
                    }
                  />
                </FieldGroup>
              </Col>


              {/* ========================================
                  COUNTRY
              ======================================== */}

              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Country"
                  icon={
                    <PublicOutlined />
                  }
                >
                  <Form.Select
                    size="sm"
                    name="country"
                    value={
                      F.values.country
                    }
                    onChange={
                      F.handleChange
                    }
                    onBlur={
                      F.handleBlur
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
                          {country.name} (
                          {country.code})
                        </option>
                      )
                    )}
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                PREFERRED COURSES
            ======================================== */}

            <Section
              title="Preferred Courses"
              icon={
                <School />
              }
            >
              <div
                style={{
                  display:
                    "flex",

                  flexWrap:
                    "wrap",

                  gap:
                    8,
                }}
              >
                {courseData
                  .filter(
                    (
                      course
                    ) =>
                      Boolean(
                        course.courseName
                      )
                  )
                  .map(
                    (
                      course
                    ) => {
                      const name =
                        course.courseName.trim();


                      const selected =
                        F.values.preferredCourses.includes(
                          name
                        );


                      return (
                        <button
                          key={
                            course._id
                          }
                          type="button"
                          onClick={() =>
                            toggleCourse(
                              name
                            )
                          }
                          style={{
                            fontSize:
                              12,

                            fontWeight:
                              600,

                            padding:
                              "5px 13px",

                            borderRadius:
                              20,

                            cursor:
                              "pointer",

                            transition:
                              "all 0.15s",

                            border:
                              `1.5px solid ${
                                selected
                                  ? "#2563eb"
                                  : "#cbd5e1"
                              }`,

                            backgroundColor:
                              selected
                                ? "#eff6ff"
                                : "#fff",

                            color:
                              selected
                                ? "#1d4ed8"
                                : "#64748b",
                          }}
                        >
                          {selected
                            ? "✓ "
                            : ""}

                          {name}
                        </button>
                      );
                    }
                  )}
              </div>


              {/* ========================================
                  COURSE VALIDATION
              ======================================== */}

              {F.touched.preferredCourses &&
                F.errors.preferredCourses && (
                  <p
                    style={{
                      fontSize:
                        11,

                      color:
                        "#ef4444",

                      marginTop:
                        6,

                      marginBottom:
                        0,
                    }}
                  >
                    {String(
                      F.errors.preferredCourses
                    )}
                  </p>
                )}
            </Section>
          </div>
        </Modal.Body>


        {/* ========================================
            FOOTER
        ======================================== */}

        <ModalFooterBlock
          onClose={
            handleClose
          }
          submitText="Submit"
          submitting={
            formik.isSubmitting
          }
        />
      </Form>
    </Modal>
  );
};

export default ModalAddStudent;