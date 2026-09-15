import {
  useEffect,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";

import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Edit,
  School,
  AttachMoney,
  Schedule,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";

import { url } from "../../utils/constant";

/*
  Shared Course interface.

  This represents Course data returned from the backend.
*/
import type {
  Course,
} from "../../../types/course";


/*
  Shared form utilities that we already migrated.

  CourseFormValues is different from Course because
  HTML inputs may temporarily contain strings.

  Example:
    courseFee = "500"

  while the user is editing the form.
*/
import {
  courseValidationSchema,
  getCourseEditInitialValues,
  labelStyle,
  inputStyle,
  disabledInputStyle,
  calculateNoOfDays,
  getAuthConfig,
} from "./CourseValidation";

import type {
  CourseFormValues,
} from "./CourseValidation";


/* =========================================================
   COMPONENT PROPS
========================================================= */

interface ModalEditCourseProps {
  /*
    Controls whether the Edit Course modal is visible.
  */
  show: boolean;


  /*
    React boolean state setter.

    Comes from something like:

      const [showEdit, setShowEdit]
        = useState<boolean>(false);
  */
  setShow: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    The selected Course may initially be null
    before the user chooses a row to edit.
  */
  singleCourse: Course | null;


  /*
    After updating the Course, we fetch the latest
    Course[] and update the parent table.
  */
  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;
}


/* =========================================================
   API TYPES
========================================================= */

/*
  Expected response from:

    PUT /updatecourse/:id
*/
interface UpdateCourseResponse {
  /*
    Your current code only checks whether response.data exists.

    We keep this flexible for now because we haven't inspected
    the exact backend update response yet.
  */
  message?: string;

  courseDetail?: Course;
}


/*
  Expected response from:

    GET /allcourse
*/
interface CoursesResponse {
  courseData: Course[];
}


/*
  Formik allows numeric values to temporarily be strings.

  Before sending them to the backend, we create a clean
  numeric API payload.
*/
interface UpdateCoursePayload {
  courseName: string;
  courseType: string;
  courseAvailability: string;

  courseFee: number;
  dailySessionHrs: number;
  courseDuration: number;
  noOfDays: number;
}


/* =========================================================
   MODAL STYLE
========================================================= */

/*
  Standard React CSSProperties does not know Bootstrap's
  custom CSS variable:

    --bs-modal-border-radius

  so we extend CSSProperties with that property.
*/
type ModalStyle = CSSProperties & {
  "--bs-modal-border-radius": string;
};


const modalStyle: ModalStyle = {
  "--bs-modal-border-radius": "16px",
};


/* =========================================================
   COMPONENT
========================================================= */

const ModalEditCourse = ({
  show,
  setShow,
  singleCourse,
  setCourseData,
}: ModalEditCourseProps) => {
  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = (): void => {
    setShow(false);
  };


  /* =======================================================
     FORMIK
  ======================================================= */

  /*
    <CourseFormValues> tells Formik exactly which fields
    exist in this form.

    TypeScript now understands things such as:

      formik.values.courseName
      formik.values.courseFee
      formik.values.noOfDays
  */
  const formik =
    useFormik<CourseFormValues>({
      /*
        Convert the selected Course into values suitable
        for HTML form inputs.

        singleCourse may be:
          Course
          null

        getCourseEditInitialValues() already handles both.
      */
      initialValues:
        getCourseEditInitialValues(
          singleCourse
        ),

      /*
        Important for an Edit modal.

        If the user selects a different Course,
        Formik will rebuild its form values from
        the newly selected Course.
      */
      enableReinitialize: true,

      validationSchema:
        courseValidationSchema,


      /*
        values is automatically:
          CourseFormValues
      */
      onSubmit: async (values) => {
        await updateCourse(values);
      },
    });


  /* =======================================================
     UPDATE COURSE
  ======================================================= */

  const updateCourse = async (
    updatedCourse: CourseFormValues
  ): Promise<void> => {
    /*
      TypeScript reminds us that singleCourse can be null.

      We must therefore verify that a Course and _id exist
      before making the update request.
    */
    if (!singleCourse?._id) {
      toast.error(
        "No course selected for editing."
      );

      return;
    }


    try {
      /*
        Convert the Formik values into the types
        expected by the backend.

        Formik:
          "500"

        becomes:

          500
      */
      const payload: UpdateCoursePayload = {
        courseName:
          updatedCourse.courseName,

        courseType:
          updatedCourse.courseType,

        courseAvailability:
          updatedCourse.courseAvailability,

        courseFee:
          Number(
            updatedCourse.courseFee
          ),

        dailySessionHrs:
          Number(
            updatedCourse.dailySessionHrs
          ),

        courseDuration:
          Number(
            updatedCourse.courseDuration
          ),

        noOfDays:
          Number(
            updatedCourse.noOfDays
          ),
      };


      /*
        TypeScript now knows the response body should
        follow UpdateCourseResponse.
      */
      const updateRes =
        await axios.put<UpdateCourseResponse>(
          `${url}/updatecourse/${singleCourse._id}`,

          payload,

          getAuthConfig()
        );


      /*
        Preserve your original behaviour:
        if the backend returned data, refresh the table.
      */
      if (updateRes.data) {
        const freshData =
          await axios.get<CoursesResponse>(
            `${url}/allcourse`,
            getAuthConfig()
          );


        /*
          setCourseData only accepts Course[].

          Because the Axios response is typed,
          TypeScript knows this value is Course[].
        */
        setCourseData(
          freshData.data.courseData ?? []
        );


        toast.success(
          "Course updated successfully!"
        );


        /*
          Keep your existing 1-second delay
          before closing the modal.
        */
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } catch (error: unknown) {
      /*
        Under strict TypeScript, caught errors
        should be treated as unknown.

        We don't assume error.response or error.message
        exists unless we narrow the type first.
      */
      console.error(
        "Error Editing Course:",
        error
      );

      toast.error(
        "Failed to update course. Please try again."
      );
    }
  };


  /* =======================================================
     AUTO-CALCULATE NUMBER OF DAYS
  ======================================================= */

  useEffect(() => {
    const {
      courseDuration,
      dailySessionHrs,
    } = formik.values;


    /*
      calculateNoOfDays accepts:
        string | number

      and returns:
        number | ""
    */
    const days =
      calculateNoOfDays(
        courseDuration,
        dailySessionHrs
      );


    /*
      noOfDays in CourseFormValues accepts:
        string | number

      so both:
        ""
        5

      are valid.
    */
    formik.setFieldValue(
      "noOfDays",
      days
    );
  }, [
    formik.values.courseDuration,
    formik.values.dailySessionHrs,
  ]);


  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={modalStyle}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <Modal.Header
        closeButton
        style={{
          background:
            "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",

          color: "white",
          borderBottom: "none",

          borderRadius:
            "16px 16px 0 0",

          padding:
            "20px 24px",
        }}
      >
        <Modal.Title
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          <Edit
            sx={{
              fontSize: "32px",
            }}
          />

          Edit Course
        </Modal.Title>
      </Modal.Header>


      {/* =====================================
          FORM
      ====================================== */}

      <Form
        onSubmit={
          formik.handleSubmit
        }
      >
        <Modal.Body
          style={{
            padding: "20px",
            backgroundColor:
              "#f9fafb",
          }}
        >
          {/* =================================
              Row 1: Name & Type
          ================================= */}

          <Row className="g-2 mb-2">
            {/* Course Name */}

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <School
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Course Name
                </Form.Label>


                <Form.Control
                  type="text"
                  name="courseName"

                  value={
                    formik.values
                      .courseName
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                />


                {formik.errors
                  .courseName &&
                  formik.touched
                    .courseName && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .courseName
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>


            {/* Course Type */}

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <Schedule
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Course Type
                </Form.Label>


                <Form.Select
                  name="courseType"

                  value={
                    formik.values
                      .courseType
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                >
                  <option value="">
                    --Select Type--
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>
                </Form.Select>


                {formik.errors
                  .courseType &&
                  formik.touched
                    .courseType && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .courseType
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>


          {/* =================================
              Row 2: Fee & Daily Hours
          ================================= */}

          <Row className="g-2 mb-2">
            {/* Course Fee */}

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <AttachMoney
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Course Fee
                </Form.Label>


                <Form.Control
                  type="number"
                  name="courseFee"

                  value={
                    formik.values
                      .courseFee
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                />


                {formik.errors
                  .courseFee &&
                  formik.touched
                    .courseFee && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .courseFee
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>


            {/* Daily Session Hours */}

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <AccessTime
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Daily Session Hours
                </Form.Label>


                <Form.Control
                  type="number"
                  name="dailySessionHrs"

                  value={
                    formik.values
                      .dailySessionHrs
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                />


                {formik.errors
                  .dailySessionHrs &&
                  formik.touched
                    .dailySessionHrs && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .dailySessionHrs
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>


          {/* =================================
              Row 3
          ================================= */}

          <Row className="g-2">
            {/* Availability */}

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <CalendarToday
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Availability
                </Form.Label>


                <Form.Select
                  name="courseAvailability"

                  value={
                    formik.values
                      .courseAvailability
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                >
                  <option value="">
                    --Select--
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </Form.Select>


                {formik.errors
                  .courseAvailability &&
                  formik.touched
                    .courseAvailability && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .courseAvailability
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>


            {/* Total Hours */}

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <Schedule
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Total Hours
                </Form.Label>


                <Form.Control
                  type="number"
                  name="courseDuration"

                  value={
                    formik.values
                      .courseDuration
                  }

                  onChange={
                    formik.handleChange
                  }

                  onBlur={
                    formik.handleBlur
                  }

                  style={inputStyle}
                />


                {formik.errors
                  .courseDuration &&
                  formik.touched
                    .courseDuration && (
                    <div
                      className="text-danger"
                      style={{
                        fontSize:
                          "11px",

                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        formik.errors
                          .courseDuration
                      }
                    </div>
                  )}
              </Form.Group>
            </Col>


            {/* Number of Days */}

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <CalendarToday
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Number of Days
                </Form.Label>


                <Form.Control
                  disabled
                  type="number"
                  name="noOfDays"

                  value={
                    formik.values
                      .noOfDays
                  }

                  style={
                    disabledInputStyle
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>


        {/* =====================================
            FOOTER
        ====================================== */}

        <Modal.Footer
          style={{
            borderTop:
              "1px solid #e5e7eb",

            padding:
              "12px 20px",

            backgroundColor:
              "#ffffff",

            borderRadius:
              "0 0 16px 16px",

            gap: "8px",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}

            style={{
              backgroundColor:
                "transparent",

              border:
                "1px solid #d1d5db",

              color:
                "#6b7280",

              fontWeight:
                "600",

              fontSize:
                "13px",

              padding:
                "7px 18px",

              borderRadius:
                "6px",
            }}
          >
            Cancel
          </Button>


          <Button
            type="submit"

            /*
              Extra protection:
              if no Course is selected,
              the Save button is disabled.
            */
            disabled={
              !singleCourse?._id ||
              formik.isSubmitting
            }

            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",

              border:
                "none",

              fontWeight:
                "600",

              fontSize:
                "13px",

              padding:
                "7px 20px",

              borderRadius:
                "6px",

              boxShadow:
                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};


export default ModalEditCourse;