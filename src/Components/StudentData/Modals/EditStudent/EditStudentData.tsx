import {
  useMemo,
  useState,
} from "react";

import type {
  CSSProperties,
  Dispatch,
  FocusEvent,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  Col,
  Row,
} from "react-bootstrap";

import {
  useFormik,
} from "formik";

import {
  toast,
} from "react-toastify";

import axios from "axios";

import {
  url,
} from "../../../utils/constant";

import {
  FieldGroup,
  Section,
  panelStyle,
} from "../CreateStudent/studentFormStyle";

import {
  editStudentSchema,
} from "./editStudentSchema";

import type {
  EditStudentFormValues,
  StudentTitle,
  UpdateStudentPayload,
} from "./editStudentSchema";

import type {
  StudentFormGender,
} from "../CreateStudent/StudentSchema";

import useCountryCode from "../CreateStudent/CountryCode";

import {
  Person,
  Email,
  Phone,
  Lock,
  Cake,
  School,
  PublicOutlined,
  WcOutlined,
  Edit as EditIcon,
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

interface EditStudentDataProps {
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * No Student is selected before the user
   * clicks the Edit button, so null is valid.
   */
  singleStudent:
    Student | null;

  setSingleStudent: Dispatch<
    SetStateAction<Student | null>
  >;

  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;

  courseData: Course[];
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface StudentListResponse {
  studentData: Student[];
}

interface ApiErrorResponse {
  message?: string;
}


// ========================================
// LEGACY STUDENT COMPATIBILITY
// ========================================

/*
 * Important:
 *
 * The current Student table passes a flat Student:
 *
 * student.firstName
 * student.lastName
 * student.email
 *
 * but this old Edit modal was still trying to read:
 *
 * singleStudent.userId.firstName
 *
 * That can cause the Edit form to open with empty fields.
 *
 * During migration we support BOTH shapes so the modal
 * works with the current flat Student data while remaining
 * compatible with any older records that still contain userId.
 */
interface LegacyStudentUser {
  title?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  phoneNumber?: string;

  gender?: string;

  birthdate?:
    | string
    | null;

  country?: string;
}

type StudentWithLegacyUser =
  Student & {
    title?: string;

    userId?: LegacyStudentUser;
  };


// ========================================
// FORM OPTIONS
// ========================================

const TITLE_OPTIONS:
  StudentTitle[] = [
    "",
    "Mr",
    "Ms",
    "Mrs",
    "Mx",
    "Dr",
    "Prof",
  ];


const GENDER_OPTIONS:
  StudentFormGender[] = [
    "male",
    "female",
    "Rather not say",
  ];


// ========================================
// STYLE TYPES
// ========================================

type FocusedField =
  | keyof EditStudentFormValues
  | null;


interface InputStyleOptions {
  focused: boolean;

  disabled: boolean;
}


// ========================================
// MODAL STYLE
// ========================================

const modalStyle:
  CSSProperties & {
    "--bs-modal-border-radius": string;
  } = {
  "--bs-modal-border-radius":
    "16px",
};


// ========================================
// INPUT STYLES
// ========================================

const inputBase:
  CSSProperties = {
  fontSize:
    13,

  borderRadius:
    10,

  border:
    "1px solid #e2e8f0",

  padding:
    "9px 12px",

  backgroundColor:
    "#fff",

  color:
    "#1e293b",

  boxShadow:
    "0 1px 0 rgba(15, 23, 42, 0.02)",

  transition:
    "border-color .15s ease, box-shadow .15s ease, transform .05s ease",
};


const inputFocus:
  CSSProperties = {
  border:
    "1px solid #60a5fa",

  boxShadow:
    "0 0 0 4px rgba(59, 130, 246, 0.18)",
};


const inputDisabled:
  CSSProperties = {
  backgroundColor:
    "#f1f5f9",

  color:
    "#94a3b8",

  cursor:
    "not-allowed",
};


// ========================================
// HELPER FUNCTIONS
// ========================================

/*
 * TypeScript:
 * Backend/legacy data may contain an unexpected
 * gender string, so normalize it before assigning
 * it to our strict StudentFormGender type.
 */
const normalizeGender = (
  value:
    string | undefined
): StudentFormGender => {
  if (
    value === "male" ||
    value === "female" ||
    value ===
      "Rather not say"
  ) {
    return value;
  }


  return "Rather not say";
};


const normalizeTitle = (
  value:
    string | undefined
): StudentTitle => {
  if (
    TITLE_OPTIONS.includes(
      value as StudentTitle
    )
  ) {
    return value as StudentTitle;
  }


  return "";
};


/*
 * Convert a backend ISO date into the format
 * required by <input type="date">:
 *
 * YYYY-MM-DD
 */
const formatBirthDate = (
  value:
    | string
    | null
    | undefined
): string => {
  if (!value) {
    return "";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date
    .toISOString()
    .split("T")[0];
};


// ========================================
// COMPONENT
// ========================================

const EditStudentData = ({
  show,
  setShow,
  setSingleStudent,
  singleStudent,
  setStudentData,
  courseData,
}: EditStudentDataProps) => {
  // ========================================
  // FOCUSED FIELD
  // ========================================

  const [
    focusedField,
    setFocusedField,
  ] =
    useState<FocusedField>(
      null
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


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

      setSingleStudent(
        null
      );
    };


  // ========================================
  // INPUT STYLE HELPER
  // ========================================

  const getInputStyle = ({
    focused,
    disabled,
  }: InputStyleOptions): CSSProperties => ({
    ...inputBase,

    ...(focused
      ? inputFocus
      : {}),

    ...(disabled
      ? inputDisabled
      : {}),
  });


  // ========================================
  // CURRENT STUDENT SOURCE
  // ========================================

  /*
   * Cast locally only.
   *
   * We do NOT add userId to the global Student type
   * because the current Student model is flat.
   */
  const studentSource =
    singleStudent as
      | StudentWithLegacyUser
      | null;


  const legacyUser =
    studentSource?.userId;


  // ========================================
  // INITIAL DATE
  // ========================================

  const formattedBirthDate =
    formatBirthDate(
      legacyUser?.birthdate ??
        studentSource?.birthdate
    );


  // ========================================
  // UPDATE STUDENT
  // ========================================

  const updateStudent =
    async (
      updatedStudent:
        UpdateStudentPayload
    ): Promise<void> => {
      if (
        !singleStudent?._id
      ) {
        throw new Error(
          "Missing student id"
        );
      }


      await axios.put(
        `${url}/updatestudent/${singleStudent._id}`,
        updatedStudent,
        config
      );
    };


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<EditStudentFormValues>({
      initialValues: {
        /*
         * Prefer the old nested userId shape if it
         * exists, otherwise use the current flat
         * Student properties.
         */
        title:
          normalizeTitle(
            legacyUser?.title ??
              studentSource?.title
          ),

        firstName:
          legacyUser?.firstName ??
          studentSource?.firstName ??
          "",

        lastName:
          legacyUser?.lastName ??
          studentSource?.lastName ??
          "",

        /*
         * Password is intentionally never loaded
         * into this form.
         */
        password:
          "",

        email:
          legacyUser?.email ??
          studentSource?.email ??
          "",

        phoneNumber:
          legacyUser?.phoneNumber ??
          studentSource?.phoneNumber ??
          "",

        gender:
          normalizeGender(
            legacyUser?.gender ??
              studentSource?.gender
          ),

        birthdate:
          formattedBirthDate,

        country:
          legacyUser?.country ??
          studentSource?.country ??
          "",

        preferredCourses:
          Array.isArray(
            studentSource
              ?.preferredCourses
          )
            ? studentSource
                .preferredCourses
            : [],
      },

      validationSchema:
        editStudentSchema,

      /*
       * singleStudent changes whenever the user
       * clicks Edit on another Student.
       */
      enableReinitialize:
        true,

      onSubmit: async (
        values,
        {
          setSubmitting,
        }
      ): Promise<void> => {
        try {
          /*
           * Do NOT send password.
           *
           * The password field is blank and locked
           * in the Edit UI.
           */
          const {
            password:
              _password,
            ...payload
          } =
            values;


          await updateStudent(
            payload
          );


          // ----------------------------------------
          // REFRESH STUDENT LIST
          // ----------------------------------------

          const refreshed =
            await axios.get<StudentListResponse>(
              `${url}/all-student`,
              config
            );


          setStudentData(
            refreshed.data.studentData
          );


          toast.success(
            "Student updated successfully!"
          );


          setTimeout(() => {
            handleClose();
          }, 400);
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError<ApiErrorResponse>(
              error
            )
          ) {
            console.error(
              "Update failed:",
              error.response?.data ??
                error.message
            );


            toast.error(
              error.response
                ?.data
                ?.message ??
                "Failed to update student."
            );

            return;
          }


          console.error(
            "Update failed:",
            error
          );


          toast.error(
            "Failed to update student."
          );
        } finally {
          setSubmitting(
            false
          );
        }
      },
    });


  const F =
    formik;


  // ========================================
  // FOCUS PROPS
  // ========================================

  /*
   * HTMLElement is broad enough for:
   *
   * input
   * textarea
   * select
   *
   * so the same helper can be spread onto both
   * Form.Control and Form.Select.
   */
  const focusProps = (
    name:
      keyof EditStudentFormValues
  ) => ({
    onFocus:
      (): void => {
        setFocusedField(
          name
        );
      },

    onBlur: (
      event:
        FocusEvent<HTMLElement>
    ): void => {
      F.handleBlur(
        event
      );

      setFocusedField(
        null
      );
    },
  });


  // ========================================
  // TOGGLE PREFERRED COURSE
  // ========================================

  const toggleCourse = (
    courseName: string
  ): void => {
    const current =
      F.values
        .preferredCourses;


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


  // ========================================
  // FIELD LOCK
  // ========================================

  /*
   * Existing behaviour:
   * normal Student fields remain editable.
   *
   * Password stays independently locked below.
   */
  const lockFields =
    false;


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

      <Modal.Header
        closeButton
        style={{
          background:
            "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",

          color:
            "white",

          borderBottom:
            "none",

          borderRadius:
            "16px 16px 0 0",

          padding:
            "16px 22px",
        }}
      >
        <Modal.Title
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              12,

            fontSize:
              22,

            fontWeight:
              600,
          }}
        >
          <EditIcon
            sx={{
              fontSize:
                32,
            }}
          />

          Edit Student Information
        </Modal.Title>
      </Modal.Header>


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
                TITLE / NAME / GENDER
            ======================================== */}

            <Row className="g-1">
              {/* Title */}

              <Col
                xs={12}
                md={3}
              >
                <FieldGroup
                  label="Title"
                  icon={
                    <Person />
                  }
                >
                  <Form.Select
                    size="sm"
                    name="title"
                    value={
                      F.values.title
                    }
                    onChange={
                      F.handleChange
                    }
                    {...focusProps(
                      "title"
                    )}
                    disabled={
                      lockFields
                    }
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "title",

                        disabled:
                          lockFields,
                      })
                    }
                  >
                    {TITLE_OPTIONS.map(
                      (
                        title
                      ) => (
                        <option
                          key={
                            title
                          }
                          value={
                            title
                          }
                        >
                          {title ||
                            "—"}
                        </option>
                      )
                    )}
                  </Form.Select>
                </FieldGroup>
              </Col>


              {/* First Name */}

              <Col
                xs={12}
                md={4}
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
                    {...focusProps(
                      "firstName"
                    )}
                    disabled={
                      lockFields
                    }
                    placeholder="e.g. John"
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "firstName",

                        disabled:
                          lockFields,
                      })
                    }
                  />
                </FieldGroup>
              </Col>


              {/* Last Name */}

              <Col
                xs={12}
                md={5}
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
                    {...focusProps(
                      "lastName"
                    )}
                    disabled={
                      lockFields
                    }
                    placeholder="e.g. Doe"
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "lastName",

                        disabled:
                          lockFields,
                      })
                    }
                  />
                </FieldGroup>
              </Col>


              {/* Gender */}

              <Col xs={12}>
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
                                lockFields
                                  ? "not-allowed"
                                  : "pointer",

                              opacity:
                                lockFields
                                  ? 0.6
                                  : 1,

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
                              disabled={
                                lockFields
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
            </Row>


            {/* ========================================
                CONTACT / BIRTHDATE / COUNTRY
            ======================================== */}

            <Row className="g-1">
              {/* Email */}

              <Col
                xs={12}
                md={7}
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
                    {...focusProps(
                      "email"
                    )}
                    disabled={
                      lockFields
                    }
                    placeholder="email@example.com"
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "email",

                        disabled:
                          lockFields,
                      })
                    }
                  />
                </FieldGroup>
              </Col>


              {/* Phone */}

              <Col
                xs={12}
                md={5}
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
                    {...focusProps(
                      "phoneNumber"
                    )}
                    disabled={
                      lockFields
                    }
                    placeholder="+81 90-0000-0000"
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "phoneNumber",

                        disabled:
                          lockFields,
                      })
                    }
                  />
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
                    {...focusProps(
                      "birthdate"
                    )}
                    disabled={
                      lockFields
                    }
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "birthdate",

                        disabled:
                          lockFields,
                      })
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
                    {...focusProps(
                      "country"
                    )}
                    disabled={
                      lockFields ||
                      countryLoading
                    }
                    style={
                      getInputStyle({
                        focused:
                          focusedField ===
                          "country",

                        disabled:
                          lockFields ||
                          countryLoading,
                      })
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


              {/* ========================================
                  PASSWORD - LOCKED
              ======================================== */}

              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Password"
                  icon={
                    <Lock />
                  }
                >
                  <Form.Control
                    size="sm"
                    type="password"
                    name="password"
                    value={
                      F.values.password
                    }
                    disabled
                    readOnly
                    placeholder="********"
                    style={
                      getInputStyle({
                        focused:
                          false,

                        disabled:
                          true,
                      })
                    }
                  />
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
                          onClick={() => {
                            if (
                              !lockFields
                            ) {
                              toggleCourse(
                                name
                              );
                            }
                          }}
                          disabled={
                            lockFields
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
                              lockFields
                                ? "not-allowed"
                                : "pointer",

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

                            opacity:
                              lockFields
                                ? 0.6
                                : 1,
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
            </Section>
          </div>
        </Modal.Body>


        {/* ========================================
            FOOTER
        ======================================== */}

        <Modal.Footer
          style={{
            borderTop:
              "1px solid #e5e7eb",

            padding:
              "12px 16px",

            backgroundColor:
              "#fff",

            borderRadius:
              "0 0 16px 16px",

            gap:
              10,

            display:
              "flex",

            justifyContent:
              "flex-end",
          }}
        >
          <Button
            /*
             * Important:
             * This is inside a <Form>, so it must be
             * type="button" or it may submit the form.
             */
            type="button"
            variant="secondary"
            onClick={
              handleClose
            }
            style={{
              backgroundColor:
                "transparent",

              border:
                "1px solid #d1d5db",

              color:
                "#6b7280",

              fontWeight:
                900,

              fontSize:
                13,

              padding:
                "8px 16px",

              borderRadius:
                10,
            }}
          >
            Cancel
          </Button>


          <Button
            type="submit"
            disabled={
              F.isSubmitting
            }
            style={{
              border:
                "none",

              fontWeight:
                900,

              fontSize:
                13,

              padding:
                "8px 18px",

              borderRadius:
                10,

              boxShadow:
                F.dirty
                  ? "0 10px 22px rgba(37, 99, 235, 0.22)"
                  : "none",

              transition:
                "all 0.2s",

              cursor:
                F.dirty
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {F.isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditStudentData;