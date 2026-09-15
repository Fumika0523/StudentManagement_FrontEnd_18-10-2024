import {
  useCallback,
  useEffect,
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

import * as Yup from "yup";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../utils/constant";

import {
  useAuthConfig,
} from "../utils/useAuthConfig";

import ModalHeaderBlock from "../Common/ModalHeaderBlock";
import ModalFooterBlock from "../Common/ModalFooterBlock";

import {
  FieldGroup,
  inputStyle,
  panelStyle,
} from "../StudentData/Modals/CreateStudent/studentFormStyle";

import {
  RiEdit2Fill,
} from "react-icons/ri";

import {
  LayersOutlined,
  AssignmentIndOutlined,
  School,
  Person,
  EventAvailable,
  CalendarMonth,
  PaymentsOutlined,
  ShareOutlined,
} from "@mui/icons-material";


// ========================================
// SHARED TYPES
// ========================================

import type {
  Admission,
  AdmissionStatus,
} from "../../types/admission";

import type {
  Course,
} from "../../types/course";

import type {
  Student,
} from "../../types/student";

import type {
  Batch,
} from "../../types/batch";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalEditAdmissionProps {
  // Controls whether the Edit modal is visible.
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * The table only opens this modal after an
   * Admission has been selected.
   */
  singleAdmission: Admission;

  // Used to refresh the Admission table after update.
  setAdmissionData: Dispatch<
    SetStateAction<Admission[]>
  >;
}


// ========================================
// FORM VALUES
// ========================================

/*
 * TypeScript:
 * The backend Admission type contains some optional
 * properties, but Formik works better with concrete
 * values rather than undefined.
 *
 * Therefore the Edit form converts missing values
 * into "".
 */
interface EditAdmissionFormValues {
  batchNumber: string;

  courseId: string;

  studentId: string;

  studentName: string;

  courseName: string;

  admissionSource: string;

  admissionFee:
    | number
    | "";

  admissionDate: string;

  admissionYear:
    | number
    | "";

  admissionMonth: string;

  status: AdmissionStatus;
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface UpdateAdmissionResponse {
  admission: Admission;
}

interface AdmissionListResponse {
  admissionData: Admission[];
}

interface CourseListResponse {
  courseData: Course[];
}

interface StudentListResponse {
  studentData: Student[];
}

interface BatchListResponse {
  batchData: Batch[];
}


// ========================================
// DATE HELPER TYPE
// ========================================

interface DateParts {
  month: string;
  year: number | "";
}


// ========================================
// BOOTSTRAP MODAL STYLE
// ========================================

/*
 * Bootstrap uses this custom CSS variable.
 * CSSProperties does not know custom properties,
 * so we explicitly extend the type.
 */
const modalStyle:
  CSSProperties & {
    "--bs-modal-border-radius": string;
  } = {
  "--bs-modal-border-radius": "16px",
};


// ========================================
// COMPONENT
// ========================================

const ModalEditAdmission = ({
  show,
  setShow,
  singleAdmission,
  setAdmissionData,
}: ModalEditAdmissionProps) => {
  // ========================================
  // API DATA
  // ========================================

  const [
    courseData,
    setCourseData,
  ] = useState<Course[]>([]);

  const [
    studentData,
    setStudentData,
  ] = useState<Student[]>([]);

  const [
    batchData,
    setBatchData,
  ] = useState<Batch[]>([]);


  // ========================================
  // AUTH / NAVIGATION
  // ========================================

  /*
   * Reuse our shared authenticated Axios config
   * instead of recreating the token configuration
   * inside this component.
   */
  const config =
    useAuthConfig();

  const navigate =
    useNavigate();


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
  // VALIDATION
  // ========================================

  /*
   * TypeScript:
   * Connect Yup directly to the Formik value type.
   */
  const formSchema:
    Yup.ObjectSchema<EditAdmissionFormValues> =
    Yup.object({
      batchNumber:
        Yup.string()
          .required(
            "Please select Batch Number!"
          )
          .defined(),

      courseId:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      studentId:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      courseName:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      studentName:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      admissionSource:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      admissionFee:
        Yup.mixed<
          number | ""
        >()
          .defined()
          .test(
            "valid-admission-fee",
            "Mandatory field!",
            (value) => {
              if (
                value === ""
              ) {
                return false;
              }

              return Number.isFinite(
                Number(value)
              );
            }
          ),

      admissionDate:
        Yup.string()
          .required(
            "Mandatory field!"
          )
          .defined(),

      admissionYear:
        Yup.mixed<
          number | ""
        >()
          .defined()
          .test(
            "valid-admission-year",
            "Mandatory field!",
            (value) => {
              if (
                value === ""
              ) {
                return false;
              }

              return Number.isFinite(
                Number(value)
              );
            }
          ),

      admissionMonth:
        Yup.string()
          .defined(),

      status:
        Yup.mixed<
          AdmissionStatus
        >()
          .oneOf([
            "Assigned",
            "De-assigned",
          ])
          .defined(),
    });


  // ========================================
  // INITIAL DATE
  // ========================================

  /*
   * Convert MongoDB/ISO date into the YYYY-MM-DD
   * format expected by <input type="date">.
   */
  const initialAdmissionDate =
    singleAdmission.admissionDate
      ? new Date(
          singleAdmission.admissionDate
        )
          .toISOString()
          .split("T")[0]
      : "";


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<EditAdmissionFormValues>({
      initialValues: {
        batchNumber:
          singleAdmission.batchNumber ??
          "",

        courseId:
          singleAdmission.courseId ??
          "",

        studentId:
          singleAdmission.studentId ??
          "",

        studentName:
          singleAdmission.studentName ??
          "",

        courseName:
          singleAdmission.courseName ??
          "",

        admissionSource:
          singleAdmission.admissionSource ??
          "",

        admissionFee:
          singleAdmission.admissionFee ??
          "",

        admissionDate:
          initialAdmissionDate,

        admissionYear:
          singleAdmission.admissionYear ??
          "",

        admissionMonth:
          singleAdmission.admissionMonth ??
          "",

        /*
         * The old JSX used "Assign" here.
         *
         * That value does not exist in our actual
         * AdmissionStatus type. The valid value is
         * "Assigned".
         */
        status:
          singleAdmission.status ??
          "Assigned",
      },

      validationSchema:
        formSchema,

      enableReinitialize:
        true,

      onSubmit: async (
        values
      ): Promise<void> => {
        await updateAdmission(
          values
        );
      },
    });


  // ========================================
  // DATE HELPER
  // ========================================

  const dateFun = (
    dateString: string
  ): DateParts => {
    if (!dateString) {
      return {
        month: "",
        year: "",
      };
    }

    const date =
      new Date(dateString);

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
          month: "long",
        }
      );


    return {
      month,
      year:
        date.getFullYear(),
    };
  };


  // ========================================
  // UPDATE ADMISSION
  // ========================================

  const updateAdmission =
    async (
      updatedAdmission:
        EditAdmissionFormValues
    ): Promise<void> => {
      try {
        const response =
          await axios.put<UpdateAdmissionResponse>(
            `${url}/updateadmission/${singleAdmission._id}`,
            updatedAdmission,
            config
          );


        const updatedStudent =
          response.data.admission
            .studentName;


        // Refresh Admission data after updating.
        const list =
          await axios.get<AdmissionListResponse>(
            `${url}/alladmission`,
            config
          );


        setAdmissionData(
          list.data.admissionData
        );


        toast.success(
          `Successfully Updated for ${updatedStudent}`
        );


        /*
         * Preserve the short delay from the
         * original implementation.
         */
        setTimeout(() => {
          handleClose();
        }, 1000);
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Error in Editing Admission:",
            error.response?.data ??
              error.message
          );

          toast.error(
            "Failed to update admission."
          );

          return;
        }


        console.error(
          "Error in Editing Admission:",
          error
        );

        toast.error(
          "Failed to update admission."
        );
      }
    };


  // ========================================
  // FETCH BATCH DATA
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
  // FETCH STUDENTS
  // ========================================

  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<StudentListResponse>(
            `${url}/all-student`,
            config
          );


        setStudentData(
          response.data.studentData
        );
      },
      [config]
    );


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
  // INITIAL DATA LOAD
  // ========================================

  useEffect(() => {
    void getCourseData();
    void getStudentData();
    void getBatchData();
  }, [
    getBatchData,
    getCourseData,
    getStudentData,
  ]);


  // ========================================
  // BATCH CHANGE
  // ========================================

  /*
   * Selecting a Batch automatically fills:
   *
   * - Course name
   * - Course ID
   * - Admission fee
   */
  const handleBatchChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedBatchNumber =
      event.target.value;


    const selectedBatch =
      batchData.find(
        (batch) =>
          batch.batchNumber ===
          selectedBatchNumber
      );


    if (!selectedBatch) {
      void formik.setFieldValue(
        "batchNumber",
        selectedBatchNumber
      );

      return;
    }


    void formik.setFieldValue(
      "batchNumber",
      selectedBatch.batchNumber
    );


    const matchedCourse =
      courseData.find(
        (course) =>
          course.courseName ===
          selectedBatch.courseName
      );


    void formik.setFieldValue(
      "courseName",
      selectedBatch.courseName ??
        ""
    );


    void formik.setFieldValue(
      "courseId",
      matchedCourse?._id ??
        ""
    );


    void formik.setFieldValue(
      "admissionFee",
      matchedCourse?.courseFee ??
        ""
    );
  };


  // ========================================
  // STATUS CHANGE
  // ========================================

  const handleStatusChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const status =
      event.target
        .value as AdmissionStatus;


    void formik.setFieldValue(
      "status",
      status
    );


    /*
     * The old code showed the "De-assigned" message
     * even when Assigned was selected.
     *
     * Only show it when De-assigned is actually chosen.
     */
    if (
      status ===
      "De-assigned"
    ) {
      toast.info(
        "The status is marked as De-assigned."
      );
    }
  };


  // ========================================
  // COURSE ID CHANGE
  // ========================================

  const handleCourseIdChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedCourseId =
      event.target.value;


    const selectedCourse =
      courseData.find(
        (course) =>
          course._id ===
          selectedCourseId
      );


    void formik.setFieldValue(
      "courseId",
      selectedCourseId
    );


    void formik.setFieldValue(
      "courseName",
      selectedCourse?.courseName ??
        ""
    );


    void formik.setFieldValue(
      "admissionFee",
      selectedCourse?.courseFee ??
        ""
    );
  };


  // ========================================
  // STUDENT ID CHANGE
  // ========================================

  /*
   * Student selection is currently disabled in the UI,
   * but this handler is retained because the existing
   * component already contains the logic.
   */
  const handleStudentIdChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedStudentId =
      event.target.value;


    const selectedStudent =
      studentData.find(
        (student) =>
          student._id ===
          selectedStudentId
      );


    void formik.setFieldValue(
      "studentId",
      selectedStudentId
    );


    void formik.setFieldValue(
      "studentName",
      selectedStudent
        ?.studentName ??
        ""
    );
  };


  // ========================================
  // ADMISSION DATE CHANGE
  // ========================================

  /*
   * Keep admissionDate, admissionMonth and
   * admissionYear synchronized.
   *
   * The old JSX recalculated the displayed month/year,
   * but did not update the Formik values themselves.
   */
  const handleAdmissionDateChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    const admissionDate =
      event.target.value;


    const {
      month,
      year,
    } =
      dateFun(
        admissionDate
      );


    void formik.setFieldValue(
      "admissionDate",
      admissionDate
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


  // ========================================
  // DISABLED FIELD STYLE
  // ========================================

  const disabledStyle = {
    ...inputStyle,

    background:
      "#f8fafc",

    color:
      "#64748b",
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
        title="Edit Admission"
        icon={
          <RiEdit2Fill />
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
                    formik.touched.batchNumber &&
                    formik.errors.batchNumber
                  }
                >
                  <Form.Select
                    size="sm"
                    name="batchNumber"
                    value={
                      formik.values.batchNumber
                    }
                    onChange={
                      handleBatchChange
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


                    {batchData
                      .filter(
                        (batch) => {
                          /*
                           * Preserve the existing 7-day
                           * Batch editing restriction.
                           */
                          if (
                            !batch.startDate
                          ) {
                            return true;
                          }


                          const startDate =
                            new Date(
                              batch.startDate
                            );


                          const diffInDays =
                            (
                              Date.now() -
                              startDate.getTime()
                            ) /
                            (
                              1000 *
                              60 *
                              60 *
                              24
                            );


                          return (
                            diffInDays <=
                            7
                          );
                        }
                      )
                      .map(
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
                  label="Assignment Status"
                  icon={
                    <AssignmentIndOutlined />
                  }
                >
                  <Form.Select
                    size="sm"
                    name="status"
                    value={
                      formik.values.status
                    }
                    onChange={
                      handleStatusChange
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="Assigned">
                      Assigned
                    </option>

                    <option value="De-assigned">
                      De-assigned
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
                  label="Course ID"
                  icon={
                    <School />
                  }
                  error={
                    formik.errors.courseId
                  }
                >
                  <Form.Select
                    size="sm"
                    name="courseId"
                    value={
                      formik.values.courseId
                    }
                    onChange={
                      handleCourseIdChange
                    }
                    placeholder="Auto-filled from batch"
                    style={
                      disabledStyle
                    }
                  >
                    <option value="">
                      Select Course ID
                    </option>

                    {courseData.map(
                      (course) => (
                        <option
                          key={
                            course._id
                          }
                          value={
                            course._id
                          }
                        >
                          {
                            course._id
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
                  label="Course Name"
                  icon={
                    <School />
                  }
                  error={
                    formik.errors.courseName
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="courseName"
                    value={
                      formik.values.courseName
                    }
                    placeholder="Auto-filled from batch"
                    style={
                      disabledStyle
                    }
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                STUDENT - LOCKED
            ======================================== */}

            <Row className="g-1">
              <Col
                xs={12}
                md={6}
              >
                <FieldGroup
                  label="Student ID"
                  icon={
                    <Person />
                  }
                  error={
                    formik.errors.studentId
                  }
                >
                  <Form.Select
                    size="sm"
                    disabled
                    name="studentId"
                    value={
                      formik.values.studentId
                    }
                    onChange={
                      handleStudentIdChange
                    }
                    style={
                      disabledStyle
                    }
                  >
                    <option value="">
                      Select Student ID
                    </option>

                    {studentData.map(
                      (student) => (
                        <option
                          key={
                            student._id
                          }
                          value={
                            student._id
                          }
                        >
                          {
                            student._id
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
                  label="Student Name"
                  icon={
                    <Person />
                  }
                  error={
                    formik.errors.studentName
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="studentName"
                    value={
                      formik.values.studentName
                    }
                    style={
                      disabledStyle
                    }
                  />
                </FieldGroup>
              </Col>
            </Row>


            {/* ========================================
                DATE
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
                    formik.touched.admissionDate &&
                    formik.errors.admissionDate
                  }
                >
                  <Form.Control
                    size="sm"
                    type="date"
                    name="admissionDate"
                    value={
                      formik.values.admissionDate
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
                    value={
                      dateFun(
                        formik.values.admissionDate
                      ).month
                    }
                    style={
                      disabledStyle
                    }
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
                    value={
                      dateFun(
                        formik.values.admissionDate
                      ).year
                    }
                    style={
                      disabledStyle
                    }
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
                    formik.errors.admissionFee
                  }
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionFee"
                    value={
                      formik.values.admissionFee
                    }
                    style={
                      disabledStyle
                    }
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
                    formik.touched.admissionSource &&
                    formik.errors.admissionSource
                  }
                >
                  <Form.Select
                    size="sm"
                    name="admissionSource"
                    value={
                      formik.values.admissionSource
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
          submitText="Update"
          submitting={
            formik.isSubmitting
          }
        />
      </Form>
    </Modal>
  );
};

export default ModalEditAdmission;