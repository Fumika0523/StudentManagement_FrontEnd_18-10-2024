import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import {
  Col,
  Row,
} from "react-bootstrap";

import {
  useFormik,
} from "formik";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../../../utils/constant";

import {
  admissionInitialValues,
  studentSchema,
} from "./AdmissionSchema";

import type {
  AdmissionFormValues,
} from "./AdmissionSchema";

import {
  FieldGroup,
  inputStyle,
  panelStyle,
} from "../../../StudentData/Modals/CreateStudent/studentFormStyle";

import ModalHeaderBlock from "../../../Common/ModalHeaderBlock";
import ModalFooterBlock from "../../../Common/ModalFooterBlock";

import {
  MdAssignmentTurnedIn,
} from "react-icons/md";

import {
  CalendarMonth,
  Person,
  School,
  LayersOutlined,
  PaymentsOutlined,
  ShareOutlined,
  AssignmentIndOutlined,
  EventAvailable,
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

import type {
  Batch,
} from "../../../../types/batch";

import type {
  Admission,
} from "../../../../types/admission";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalAddAdmissionProps {
  // Controls whether the modal is visible.
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;


  // Used to refresh Admission data after adding.
  setAdmissionData: Dispatch<
    SetStateAction<Admission[]>
  >;

  admissionData: Admission[];


  // Used when deciding which students are eligible.
  studentData: Student[];

  /*
   * This prop is still passed by ActionBtns.
   *
   * The current Add Admission component does not
   * modify Student data directly, but we keep this
   * prop for compatibility while migrating the
   * surrounding Admission components.
   */
  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface CourseListResponse {
  courseData: Course[];
}

interface BatchListResponse {
  batchData: Batch[];
}

interface AdmissionListResponse {
  admissionData: Admission[];
}


// ========================================
// DATE RESULT TYPE
// ========================================

interface AdmissionDateParts {
  month: string;

  /*
   * Before the user selects a date,
   * year is represented by an empty string.
   */
  year: number | "";
}


// ========================================
// LOCAL STUDENT COMPATIBILITY TYPE
// ========================================

/*
 * The existing JavaScript checks:
 *
 * student.userId?.isActive
 *
 * but userId is not currently part of our shared
 * Student API type or backend Student schema.
 *
 * Rather than incorrectly adding it globally,
 * we represent that legacy check locally.
 */
interface StudentWithUserStatus
  extends Student {
  userId?: {
    isActive?: boolean;
  };
}


// ========================================
// COMPLETED BATCH STATUSES
// ========================================

/*
 * Students can be assigned again only when their
 * previous Batch has been fully completed.
 */
const COMPLETED_BATCH_STATUSES =
  new Set<string>([
    "Batch Completed",
  ]);


// ========================================
// BOOTSTRAP MODAL STYLE
// ========================================

/*
 * TypeScript:
 * CSSProperties does not know Bootstrap's custom
 * CSS variable, so extend it explicitly.
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

const ModalAddAdmission = ({
  show,
  setShow,
  setAdmissionData,
  admissionData,
  studentData,
}: ModalAddAdmissionProps) => {
  // ========================================
  // SELECTED FORM VALUES
  // ========================================

  const [
    courseValue,
    setCourseValue,
  ] = useState<string>("");

  const [
    batchValue,
    setBatchValue,
  ] = useState<string>("");

  const [
    batchTargetNo,
    setBatchTargetNo,
  ] = useState<number>(0);

  const [
    batchAssignedCount,
    setBatchAssignedCount,
  ] = useState<number>(0);

  const [
    studentValue,
    setStudentValue,
  ] = useState<string>("");


  // ========================================
  // API DATA
  // ========================================

  const [
    courseData,
    setCourseData,
  ] = useState<Course[]>([]);

  const [
    batchData,
    setBatchData,
  ] = useState<Batch[]>([]);


  // ========================================
  // AUTH / NAVIGATION
  // ========================================

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  /*
   * TypeScript:
   * useMemo keeps the Axios config object stable,
   * preventing unnecessary effect reruns.
   */
  const config =
    useMemo(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [token]
    );


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setShow(false);

      navigate(
        "/admissiondata"
      );
    };


  // ========================================
  // FETCH COURSES
  // ========================================

  const getCourseData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<CourseListResponse>(
            `${url}/allcourse`,
            config
          );

        setCourseData(
          response.data.courseData
        );
      },
      [config]
    );


  // ========================================
  // FETCH BATCHES
  // ========================================

  const getBatchData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<BatchListResponse>(
            `${url}/allbatch`,
            config
          );

        setBatchData(
          response.data.batchData
        );
      },
      [config]
    );


  // ========================================
  // LOAD MODAL DATA
  // ========================================

  useEffect(() => {
    /*
     * Only fetch Courses and Batches when
     * the Add Admission modal is actually open.
     */
    if (!show) {
      return;
    }

    void getCourseData();
    void getBatchData();
  }, [
    show,
    getCourseData,
    getBatchData,
  ]);


  // ========================================
  // DATE HELPER
  // ========================================

  const dateFun = (
    dateString: string
  ): AdmissionDateParts => {
    if (!dateString) {
      return {
        month: "",
        year: "",
      };
    }

    const date =
      new Date(dateString);

    /*
     * Protect against invalid date strings.
     */
    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return {
        month: "",
        year: "",
      };
    }

    const month =
      date.toLocaleString(
        "default",
        {
          month: "short",
        }
      );

    const year =
      date.getFullYear();

    return {
      month,
      year,
    };
  };


  // ========================================
  // BATCH LOOKUP MAP
  // ========================================

  /*
   * Example:
   *
   * {
   *   "2026-0001": Batch,
   *   "2026-0002": Batch
   * }
   *
   * This avoids repeatedly searching batchData.
   */
  const batchByNumber =
    useMemo<
      Record<string, Batch>
    >(() => {
      const map:
        Record<
          string,
          Batch
        > = {};

      batchData.forEach(
        (batch) => {
          map[
            batch.batchNumber
          ] = batch;
        }
      );

      return map;
    }, [batchData]);


  // ========================================
  // ADMISSIONS BY STUDENT
  // ========================================

  /*
   * Example:
   *
   * {
   *   "studentMongoId": [
   *      admission1,
   *      admission2
   *   ]
   * }
   */
  const admissionsByStudentId =
    useMemo<
      Record<
        string,
        Admission[]
      >
    >(() => {
      const map:
        Record<
          string,
          Admission[]
        > = {};

      admissionData.forEach(
        (admission) => {
          const studentId =
            String(
              admission.studentId
            );

          if (
            !map[studentId]
          ) {
            map[studentId] = [];
          }

          map[
            studentId
          ].push(
            admission
          );
        }
      );

      return map;
    }, [admissionData]);


  // ========================================
  // ELIGIBLE STUDENTS
  // ========================================

  /*
   * Business rule:
   *
   * A student can be assigned if:
   *
   * 1. They are active.
   * 2. They have no previous admissions,
   *    OR
   * 3. Every previous assigned Batch has
   *    already reached "Batch Completed".
   */
  const eligibleStudents =
    useMemo<Student[]>(() => {
      return studentData.filter(
        (student) => {
          if (!student._id) {
            return false;
          }


          /*
           * Preserve the existing legacy isActive check.
           */
          const studentWithStatus =
            student as StudentWithUserStatus;

          if (
            studentWithStatus
              .userId
              ?.isActive ===
            false
          ) {
            return false;
          }


          const studentId =
            String(
              student._id
            );

          const theirAdmissions =
            admissionsByStudentId[
              studentId
            ] ?? [];


          /*
           * A student who has never had an Admission
           * can immediately be assigned.
           */
          if (
            theirAdmissions.length ===
            0
          ) {
            return true;
          }


          /*
           * Check whether the student still belongs
           * to any Batch that is not completed.
           */
          const hasAnyActiveAssignment =
            theirAdmissions.some(
              (admission) => {
                const batch =
                  admission.batchNumber
                    ? batchByNumber[
                        admission.batchNumber
                      ]
                    : undefined;

                return (
                  !COMPLETED_BATCH_STATUSES.has(
                    batch?.status ??
                      ""
                  )
                );
              }
            );


          return (
            !hasAnyActiveAssignment
          );
        }
      );
    }, [
      studentData,
      admissionsByStudentId,
      batchByNumber,
    ]);


  // ========================================
  // ADD ADMISSION
  // ========================================

  const addAdmission =
    async (
      newAdmission:
        AdmissionFormValues
    ): Promise<void> => {
      /*
       * Keep the values selected by the user in sync
       * with the payload sent to the backend.
       */
      const admission:
        AdmissionFormValues = {
        ...newAdmission,

        studentName:
          studentValue,

        courseName:
          courseValue,

        batchNumber:
          batchValue,
      };


      try {
        await axios.post(
          `${url}/addadmission`,
          admission,
          config
        );


        /*
         * Refresh the Admission list after creation.
         */
        const list =
          await axios.get<AdmissionListResponse>(
            `${url}/alladmission`,
            config
          );


        setAdmissionData(
          list.data.admissionData
        );
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          const responseData =
            error.response
              ?.data as
              | {
                  message?: string;
                }
              | undefined;


          console.error(
            "Error adding Admission:",
            error.response
              ?.status,
            error.response
              ?.data ??
              error.message
          );


          toast.error(
            responseData
              ?.message ??
              "Add admission failed"
          );

          return;
        }


        console.error(
          "Error adding Admission:",
          error
        );

        toast.error(
          "Add admission failed"
        );
      }
    };


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<AdmissionFormValues>({
      initialValues:
        admissionInitialValues,

      validationSchema:
        studentSchema,

      enableReinitialize:
        true,


      onSubmit: async (
        values
      ): Promise<void> => {
        const studentId =
          values.studentId;

        const selectedBatchNumber =
          values.batchNumber;


        // ----------------------------------------
        // PREVENT SAME STUDENT / SAME BATCH
        // ----------------------------------------

        const alreadySameBatch =
          admissionData.some(
            (admission) =>
              String(
                admission.studentId
              ) ===
                String(
                  studentId
                ) &&
              String(
                admission.batchNumber
              ) ===
                String(
                  selectedBatchNumber
                )
          );


        if (
          alreadySameBatch
        ) {
          toast.error(
            "This student is already assigned to this batch. Please select a different batch."
          );

          return;
        }


        // ----------------------------------------
        // PREVENT MULTIPLE ACTIVE BATCHES
        // ----------------------------------------

        const theirAdmissions =
          admissionsByStudentId[
            String(studentId)
          ] ?? [];


        const hasActive =
          theirAdmissions.some(
            (admission) => {
              const batch =
                admission.batchNumber
                  ? batchByNumber[
                      admission.batchNumber
                    ]
                  : undefined;


              return (
                !COMPLETED_BATCH_STATUSES.has(
                  batch?.status ??
                    ""
                )
              );
            }
          );


        if (hasActive) {
          toast.error(
            "This student is already assigned to an active batch. They can be reassigned only after the previous batch is completed."
          );

          return;
        }


        // ----------------------------------------
        // BATCH CAPACITY
        // ----------------------------------------

        if (
          batchAssignedCount >=
          batchTargetNo
        ) {
          toast.error(
            "Sorry! This batch is full. Please try another batch or contact super admin."
          );

          return;
        }


        await addAdmission(
          values
        );


        toast.success(
          `${values.studentName} is successfully assigned to ${values.batchNumber}!`
        );


        handleClose();
      },
    });


  // ========================================
  // BATCH CHANGE
  // ========================================

  const handleBatchNumber = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedBatchNumber =
      event.target.value;


    setBatchValue(
      selectedBatchNumber
    );


    void formik.setFieldValue(
      "batchNumber",
      selectedBatchNumber
    );


    const selectedBatch =
      batchData.find(
        (batch) =>
          batch.batchNumber ===
          selectedBatchNumber
      );


    /*
     * If the Batch selection was cleared,
     * also clear all auto-filled Course data.
     */
    if (!selectedBatch) {
      setBatchAssignedCount(
        0
      );

      setBatchTargetNo(
        0
      );

      setCourseValue(
        ""
      );

      void formik.setFieldValue(
        "courseName",
        ""
      );

      void formik.setFieldValue(
        "courseId",
        ""
      );

      void formik.setFieldValue(
        "admissionFee",
        ""
      );

      return;
    }


    /*
     * assignedStudentCount is numeric.
     */
    setBatchAssignedCount(
      selectedBatch
        .assignedStudentCount ??
        0
    );


    /*
     * Batch.targetStudent is stored as String
     * by the backend, so explicitly convert it.
     */
    setBatchTargetNo(
      Number(
        selectedBatch.targetStudent ??
          0
      )
    );


    const courseName =
      selectedBatch.courseName ??
      "";


    setCourseValue(
      courseName
    );


    void formik.setFieldValue(
      "courseName",
      courseName
    );


    /*
     * Find the corresponding Course so we can
     * automatically populate Course ID and Fee.
     */
    const selectedCourse =
      courseData.find(
        (course) =>
          course.courseName ===
          courseName
      );


    void formik.setFieldValue(
      "courseId",
      selectedCourse?._id ??
        ""
    );


    void formik.setFieldValue(
      "admissionFee",
      selectedCourse
        ?.courseFee ??
        ""
    );
  };


  // ========================================
  // STUDENT CHANGE
  // ========================================

  const handleStudentNameChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedStudentName =
      event.target.value;


    setStudentValue(
      selectedStudentName
    );


    const selectedStudent =
      studentData.find(
        (student) =>
          student.studentName ===
          selectedStudentName
      );


    if (!selectedStudent) {
      return;
    }


    void formik.setFieldValue(
      "studentId",
      selectedStudent._id
    );


    void formik.setFieldValue(
      "studentName",
      selectedStudent
        .studentName ??
        ""
    );
  };


  // ========================================
  // ADMISSION DATE CHANGE
  // ========================================

  const handleAdmissionDateChange =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ): void => {
      const selectedDate =
        event.target.value;


      const {
        month,
        year,
      } =
        dateFun(
          selectedDate
        );


      void formik.setFieldValue(
        "admissionDate",
        selectedDate
      );


      void formik.setFieldValue(
        "admissionMonth",
        month
      );


      void formik.setFieldValue(
        "admissionYear",
        year
      );
    };


  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={modalStyle}
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <ModalHeaderBlock
        title="Add Admission"
        icon={
          <MdAssignmentTurnedIn />
        }
      />


      <Form
        onSubmit={
          formik.handleSubmit
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
            style={panelStyle}
          >
            {/* ========================================
                BATCH + STATUS
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Batch No."
                  icon={
                    <LayersOutlined />
                  }
                  required
                  error={
                    formik.touched
                      .batchNumber &&
                    formik.errors
                      .batchNumber
                  }
                >
                  <Form.Select
                    size="sm"
                    name="batchNumber"
                    value={
                      formik.values
                        .batchNumber
                    }
                    onChange={
                      handleBatchNumber
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="">
                      Select Batch
                    </option>

                    {batchData.map(
                      (batch) => (
                        <option
                          key={
                            batch.batchNumber
                          }
                          value={
                            batch.batchNumber
                          }
                        >
                          {
                            batch.batchNumber
                          }
                        </option>
                      )
                    )}
                  </Form.Select>
                </FieldGroup>
              </Col>


              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                   label="Status"
                  icon={
                    <AssignmentIndOutlined />
                  }
                >
                  <Form.Select
                    size="sm"
                    disabled
                    name="status"
                    value={
                      formik.values
                        .status
                    }
                    onChange={
                      formik.handleChange
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="Assigned">
                      Assigned
                    </option>
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                COURSE
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                required                  label="Course Name"
                  icon={
                    <School />
                  }
                  error={
                    formik.touched
                      .courseName &&
                    formik.errors
                      .courseName
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="courseName"
                    value={
                      formik.values
                        .courseName
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="Auto-filled from batch"
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>


              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                required
                  label="Course ID"
                  icon={
                    <School />
                  }
                  error={
                    formik.touched
                      .courseId &&
                    formik.errors
                      .courseId
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="courseId"
                    value={
                      formik.values
                        .courseId
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="Auto-filled"
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                STUDENT
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Student Name"
                  icon={
                    <Person />
                  }
                  required
                  error={
                    formik.touched
                      .studentName &&
                    formik.errors
                      .studentName
                  }
                >
                  {eligibleStudents.length ===
                  0 ? (
                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: 8,

                        padding:
                          "7px 12px",

                        borderRadius:
                          8,

                        background:
                          "#fffbeb",

                        border:
                          "1px solid #fde68a",

                        color:
                          "#92400e",

                        fontSize:
                          12,

                        fontWeight:
                          500,
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            15,
                        }}
                      >
                        ⚠️
                      </span>

                      No eligible students available
                    </div>
                  ) : (
                    <Form.Select
                      size="sm"
                      name="studentName"
                      value={
                        formik.values
                          .studentName
                      }
                      onChange={
                        handleStudentNameChange
                      }
                      onBlur={
                        formik.handleBlur
                      }
                      style={
                        inputStyle
                      }
                    >
                      <option value="">
                        -- Select --
                      </option>

                      {eligibleStudents.map(
                        (
                          student
                        ) => (
                          <option
                            key={
                              student._id
                            }
                            value={
                              student.studentName ??
                              ""
                            }
                          >
                            {student.studentName ??
                              ""}
                          </option>
                        )
                      )}
                    </Form.Select>
                  )}
                </FieldGroup>
              </Col>


              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Student ID"
                  icon={
                    <AssignmentIndOutlined />
                  }
                  error={
                    formik.touched
                      .studentId &&
                    formik.errors
                      .studentId
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="studentId"
                    value={
                      formik.values
                        .studentId
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="Auto-filled"
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                ADMISSION DATE
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={4}
              >
                <FieldGroup
                  label="Admission Date"
                  icon={
                    <EventAvailable />
                  }
                  required
                  error={
                    formik.touched
                      .admissionDate &&
                    formik.errors
                      .admissionDate
                  }
                >
                  <Form.Control
                    size="sm"
                    type="date"
                    name="admissionDate"
                    value={
                      formik.values
                        .admissionDate
                    }
                    max={
                      new Date()
                        .toISOString()
                        .split(
                          "T"
                        )[0]
                    }
                    onChange={
                      handleAdmissionDateChange
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


              <Col
                xs={12}
                md={4}
              >
                <FieldGroup
                  label="Month"
                  icon={
                    <CalendarMonth />
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionMonth"
                    value={
                      dateFun(
                        formik.values
                          .admissionDate
                      ).month
                    }
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>


              <Col
                xs={12}
                md={4}
              >
                <FieldGroup
                  label="Year"
                  icon={
                    <CalendarMonth />
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionYear"
                    value={
                      dateFun(
                        formik.values
                          .admissionDate
                      ).year
                    }
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                FEE + SOURCE
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Fee"
                  icon={
                    <PaymentsOutlined />
                  }
                  error={
                    formik.touched
                      .admissionFee &&
                    formik.errors
                      .admissionFee
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionFee"
                    value={
                      formik.values
                        .admissionFee
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="Auto-filled from course"
                    style={{
                      ...inputStyle,

                      background:
                        "#f8fafc",

                      color:
                        "#64748b",
                    }}
                  />
                </FieldGroup>
              </Col>


              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Source"
                  icon={
                    <ShareOutlined />
                  }
                  required
                  error={
                    formik.touched
                      .admissionSource &&
                    formik.errors
                      .admissionSource
                  }
                >
                  <Form.Select
                    size="sm"
                    name="admissionSource"
                    value={
                      formik.values
                        .admissionSource
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
                  >
                    <option value="">
                      -- Select --
                    </option>

                    <option value="Social">
                      Social
                    </option>

                    <option value="Referral">
                      Referral
                    </option>

                    <option value="Direct">
                      Direct
                    </option>
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>
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

export default ModalAddAdmission;
