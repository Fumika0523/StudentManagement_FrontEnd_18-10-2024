import type {
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Warning } from "@mui/icons-material";

import { url } from "../../utils/constant";

/*
  Reuse the shared Course interface.

  We don't redefine Course inside this modal.
*/
import type {
  Course,
} from "../../../types/course";

/*
  Reuse our typed authentication config hook instead of
  manually rebuilding the Axios headers in every component.
*/
import { useAuthConfig } from "../../utils/useAuthConfig";


/* =========================================================
   COMPONENT PROPS
========================================================= */

interface ModalDeleteCourseProps {
  /*
    Controls whether the warning modal is visible.
  */
  viewWarning: boolean;


  /*
    React setter for:
      useState<boolean>(false)
  */
  setViewWarning: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    The selected Course may initially be null because
    the parent table starts with:

      const [singleCourse, setSingleCourse] = useState(null);

    Later, when a user clicks Delete, it becomes a Course.
  */
  singleCourse: Course | null;


  /*
    Lets us clear the selected course when closing the modal.

    The old parent component was already passing this prop,
    but the JavaScript modal wasn't actually using it.
  */
  setSingleCourse: Dispatch<
    SetStateAction<Course | null>
  >;


  /*
    After deleting a course, we refetch all courses and
    update the parent's Course[] state.
  */
  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;
}


/* =========================================================
   API RESPONSE
========================================================= */

/*
  Expected response from:

    GET /allcourse
*/
interface CoursesResponse {
  courseData: Course[];
}


/* =========================================================
   BOOTSTRAP MODAL STYLE
========================================================= */

/*
  React's CSSProperties does not know arbitrary Bootstrap
  CSS variables such as:

    --bs-modal-border-radius

  so we extend it with that custom property.
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

const ModalDeleteCourse = ({
  viewWarning,
  setViewWarning,
  singleCourse,
  setSingleCourse,
  setCourseData,
}: ModalDeleteCourseProps) => {
  const navigate = useNavigate();

  /*
    useAuthConfig() returns AxiosRequestConfig.

    It already contains:
      Authorization: Bearer <token>
  */
  const config = useAuthConfig();


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = (): void => {
    setViewWarning(false);

    /*
      Clear the selected Course.

      This prevents the previous Course object remaining
      in state after the modal closes.
    */
    setSingleCourse(null);

    navigate("/coursedata");
  };


  /* =======================================================
     DELETE COURSE
  ======================================================= */

  /*
    MongoDB _id reaches the frontend as a string,
    therefore id is explicitly typed as string.
  */
  const handleDeleteClick = async (
    id: string
  ): Promise<void> => {
    try {
      /*
        Delete the selected course.

        We don't need to store the response because this
        component only needs to know whether the request succeeds.
      */
      await axios.delete(
        `${url}/deletecourse/${id}`,
        config
      );


      /*
        After deletion, request the latest Course[].
      */
      const response =
        await axios.get<CoursesResponse>(
          `${url}/allcourse`,
          config
        );


      /*
        setCourseData only accepts Course[].

        Because the Axios response is typed, TypeScript knows
        response.data.courseData is Course[].
      */
      setCourseData(
        response.data.courseData ?? []
      );


      toast.success(
        "Course deleted successfully!"
      );


      /*
        Preserve your existing behaviour:
        close the modal after one second.
      */
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error: unknown) {
      /*
        In strict TypeScript, caught errors should be unknown
        rather than automatically treated as any.
      */
      console.error(
        "Error Deleting Course:",
        error
      );

      toast.error(
        "Failed to delete course. Please try again."
      );
    }
  };


  return (
    <Modal
      show={viewWarning}
      onHide={handleClose}
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
            "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",

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
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          <Warning
            sx={{
              fontSize: "28px",
            }}
          />

          Delete Course
        </Modal.Title>
      </Modal.Header>


      {/* =====================================
          BODY
      ====================================== */}

      <Modal.Body
        style={{
          padding:
            "15px 15px",

          textAlign:
            "center",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          {/*
            singleCourse can technically be null because
            that is its initial parent state.

            Optional chaining prevents accessing courseName
            from null.
          */}
          Are you sure you want to delete "
          {singleCourse?.courseName ??
            "this course"}
          "?
        </p>


        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          This action cannot be undone.
        </p>
      </Modal.Body>


      {/* =====================================
          FOOTER
      ====================================== */}

      <Modal.Footer
        style={{
          borderTop:
            "1px solid #e5e7eb",

          padding:
            "16px 24px",

          backgroundColor:
            "#ffffff",

          borderRadius:
            "0 0 16px 16px",

          gap: "12px",

          justifyContent:
            "center",
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
              "14px",

            padding:
              "8px 24px",

            borderRadius:
              "8px",

            minWidth:
              "100px",
          }}
        >
          Cancel
        </Button>


        <Button
          /*
            singleCourse may be null.

            We only call the delete function if _id exists.
          */
          onClick={() => {
            if (singleCourse?._id) {
              handleDeleteClick(
                singleCourse._id
              );
            }
          }}

          /*
            Extra protection:
            if somehow no Course is selected,
            Delete cannot be clicked.
          */
          disabled={!singleCourse?._id}

          style={{
            background:
              "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",

            border:
              "none",

            fontWeight:
              "600",

            fontSize:
              "14px",

            padding:
              "8px 24px",

            borderRadius:
              "8px",

            boxShadow:
              "0 2px 4px 0 rgba(220, 38, 38, 0.2)",

            minWidth:
              "100px",
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default ModalDeleteCourse;