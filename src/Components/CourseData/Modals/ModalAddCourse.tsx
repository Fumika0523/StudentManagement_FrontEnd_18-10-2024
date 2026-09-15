import {
  useEffect,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";

import { useFormik } from "formik";

import axios from "axios";

import { toast } from "react-toastify";

import {
  AttachMoney,
  Schedule,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";

import { MdMenuBook } from "react-icons/md";

import { url } from "../../utils/constant";

import ModalFooterBlock from "../../Common/ModalFooterBlock";
import ModalHeaderBlock from "../../Common/ModalHeaderBlock";

/*
  Shared Course type.

  Course represents course data returned by the backend.
*/
import type {
  Course,
} from "../../../types/course";

/*
  Reusable Course form utilities.

  CourseFormValues is the type specifically used by Formik.
*/
import {
  courseValidationSchema,
  courseInitialValues,
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

/*
  These are the props received from CourseData/Header/Header.tsx.
*/
interface ModalAddCourseProps {
  /*
    Controls whether the modal is visible.
  */
  show: boolean;

  /*
    React setter belonging to:

      const [showAdd, setShowAdd]
        = useState<boolean>(false);
  */
  setShow: Dispatch<
    SetStateAction<boolean>
  >;

  /*
    After successfully adding a Course,
    we fetch all courses again and update:

      Course[]
  */
  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;
}


/* =========================================================
   API RESPONSE TYPES
========================================================= */

/*
  Expected response from:

    POST /addcourse
*/
interface AddCourseResponse {
  courseDetail: Course;
}


/*
  Expected response from:

    GET /allcourse
*/
interface CoursesResponse {
  courseData: Course[];
}


/* =========================================================
   API PAYLOAD
========================================================= */

/*
  Formik allows numeric inputs to temporarily contain strings.

  Example:
    "500"

  But our backend Course model expects numeric values.

  Therefore we create a separate API payload type.
*/
interface CreateCoursePayload {
  courseName: string;
  courseType: string;
  courseAvailability: string;

  courseFee: number;
  dailySessionHrs: number;
  courseDuration: number;
  noOfDays: number;
}


/* =========================================================
   BOOTSTRAP MODAL STYLE
========================================================= */

/*
  React's normal CSSProperties type does not know about
  arbitrary CSS custom properties such as:

    --bs-modal-border-radius

  So we extend CSSProperties with this Bootstrap variable.
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

function ModalAddCourse({
  show,
  setShow,
  setCourseData,
}: ModalAddCourseProps) {
  /* =======================================================
     FORMIK
  ======================================================= */

  /*
    <CourseFormValues> tells Formik exactly what fields exist.

    TypeScript now knows:

      formik.values.courseName
      formik.values.courseFee
      formik.values.courseDuration
      etc.

    A typo such as:

      formik.values.courseDuraton

    would now produce a TypeScript error.
  */
  const formik =
    useFormik<CourseFormValues>({
      initialValues:
        courseInitialValues,

      validationSchema:
        courseValidationSchema,

      /*
        `values` is automatically typed as:
          CourseFormValues
      */
      onSubmit: async (values) => {
        await addCourse(values);
      },
    });


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = (): void => {
    /*
      Close the modal.
    */
    setShow(false);

    /*
      Reset Formik back to:
        courseInitialValues
    */
    formik.resetForm();
  };


  /* =======================================================
     ADD COURSE
  ======================================================= */

  const addCourse = async (
    newCourse: CourseFormValues
  ): Promise<void> => {
    try {
      /*
        HTML number inputs can still give Formik strings.

        Example:
          "500"

        Before sending the data to the backend,
        convert the numeric fields into real numbers.
      */
      const payload: CreateCoursePayload = {
        courseName:
          newCourse.courseName,

        courseType:
          newCourse.courseType,

        courseAvailability:
          newCourse.courseAvailability,

        courseFee:
          Number(
            newCourse.courseFee
          ),

        dailySessionHrs:
          Number(
            newCourse.dailySessionHrs
          ),

        courseDuration:
          Number(
            newCourse.courseDuration
          ),

        /*
          calculateNoOfDays() may return:
            number
            ""

          By the time the validated form is submitted,
          this should contain a valid calculated number.
        */
        noOfDays:
          Number(
            newCourse.noOfDays
          ),
      };


      /*
        axios.post<ResponseType>()

        tells TypeScript what we expect:
          addRes.data

        to contain.
      */
      const addRes =
        await axios.post<AddCourseResponse>(
          `${url}/addcourse`,

          payload,

          getAuthConfig()
        );


      console.log(
        "Added course:",
        addRes.data.courseDetail.courseName
      );


      /*
        After successfully adding the course,
        request the latest Course[] from the backend.
      */
      const freshData =
        await axios.get<CoursesResponse>(
          `${url}/allcourse`,

          getAuthConfig()
        );


      /*
        setCourseData requires Course[].

        Because freshData is typed as CoursesResponse,
        TypeScript knows this is Course[].
      */
      setCourseData(
        freshData.data.courseData ?? []
      );


      toast.success(
        `${addRes.data.courseDetail.courseName} is added successfully!`
      );


      /*
        Preserve your existing behaviour:
        close the modal one second after success.
      */
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error: unknown) {
      /*
        In strict TypeScript, caught errors should be
        treated as unknown rather than any.

        We are not accessing error.response or error.message
        here, so logging unknown is safe.
      */
      console.error(
        "Error Adding Course:",
        error
      );

      toast.error(
        "Failed to add course. Please try again."
      );
    }
  };


  /* =======================================================
     AUTO-CALCULATE NUMBER OF DAYS
  ======================================================= */

  useEffect(() => {
    /*
      Because Formik is typed with CourseFormValues,
      TypeScript knows these fields can be:

        string | number
    */
    const {
      courseDuration,
      dailySessionHrs,
    } = formik.values;


    /*
      calculateNoOfDays is already typed:

        (
          string | number,
          string | number
        ) => number | ""
    */
    const days =
      calculateNoOfDays(
        courseDuration,
        dailySessionHrs
      );


    /*
      noOfDays accepts:
        string | number

      therefore both:
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
          MODAL HEADER
      ====================================== */}

      <ModalHeaderBlock
        title="Add Course"
        icon={<MdMenuBook />}
      />


      {/* =====================================
          COURSE FORM
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
              ROW 1
              Course Name / Course Type
          ================================= */}

          <Row className="g-2 mb-2">
            {/* Course Name */}

            <Col
              xs={12}
              md={6}
            >
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  {/*
                    react-icons components do not use
                    MUI's `sx` property.

                    Instead we use:
                      size={14}
                  */}
                  <MdMenuBook size={14} />

                  Course Name
                </Form.Label>


                <Form.Control
                  type="text"
                  name="courseName"

                  /*
                    Because Formik is typed,
                    courseName is known to be string.
                  */
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

                  placeholder="Enter course name"
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

            <Col
              xs={12}
              md={6}
            >
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
                    --Select--
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
              ROW 2
              Course Fee / Daily Hours
          ================================= */}

          <Row className="g-2 mb-2">
            {/* Course Fee */}

            <Col
              xs={12}
              md={6}
            >
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

                  placeholder="Enter fee amount"
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

            <Col
              xs={12}
              md={6}
            >
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

                  placeholder="Hours per day"
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
              ROW 3
              Availability / Total Hours / Days
          ================================= */}

          <Row className="g-2">
            {/* Availability */}

            <Col
              xs={12}
              md={4}
            >
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


            {/* Total Course Hours */}

            <Col
              xs={12}
              md={4}
            >
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

                  placeholder="Total hours"
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

            <Col
              xs={12}
              md={4}
            >
              <Form.Group>
                <Form.Label
                  style={labelStyle}
                >
                  <CalendarToday
                    sx={{
                      fontSize: 14,
                    }}
                  />

                  Number of Days (Auto)
                </Form.Label>


                <Form.Control
                  disabled
                  type="number"
                  name="noOfDays"

                  /*
                    noOfDays can be:
                      ""
                      number

                    Both are acceptable values
                    for this controlled input.
                  */
                  value={
                    formik.values
                      .noOfDays
                  }

                  placeholder="Auto-calculated"

                  style={
                    disabledInputStyle
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>


        {/* =====================================
            MODAL FOOTER
        ====================================== */}

        <ModalFooterBlock
          onClose={handleClose}
          submitText="Submit"

          /*
            Formik provides isSubmitting as boolean.
          */
          submitting={
            formik.isSubmitting
          }
        />
      </Form>
    </Modal>
  );
}


export default ModalAddCourse;



// // HTML input
//    ↓
// "500"
//    ↓
// CourseFormValues
//    ↓
// Number("500")
//    ↓
// 500
//    ↓
// CreateCoursePayload
//    ↓
// POST /addcourse
//    ↓
// MongoDB
//    ↓
// Course