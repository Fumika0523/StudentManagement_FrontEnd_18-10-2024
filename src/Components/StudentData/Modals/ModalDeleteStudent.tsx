import type {
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import {
  Warning as WarningIcon,
} from "@mui/icons-material";

import type {
  Student,
} from "../../../types/student";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalDeleteStudentProps {
  /*
   * Controls whether the confirmation modal
   * is currently visible.
   */
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;


  /*
   * Before the user selects a Student,
   * there is no Student to delete.
   *
   * Therefore null is a valid state.
   */
  studentToDelete:
    Student | null;


  /*
   * The parent Student table performs the
   * actual DELETE API request.
   *
   * That parent function is async, so this
   * callback may return either void or Promise<void>.
   */
  onConfirmDelete: (
    id: string
  ) => void | Promise<void>;
}


// ========================================
// MODAL STYLE
// ========================================

/*
 * Bootstrap uses a CSS custom property here.
 *
 * React.CSSProperties does not include arbitrary
 * --custom-property names, so we extend the type.
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

const ModalDeleteStudent = ({
  show,
  setShow,
  studentToDelete,
  onConfirmDelete,
}: ModalDeleteStudentProps) => {
  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setShow(
        false
      );
    };


  // ========================================
  // CONFIRM DELETE
  // ========================================

  const handleConfirm =
    (): void => {
      /*
       * TypeScript:
       * studentToDelete may still be null,
       * so check it before reading _id.
       */
      if (
        studentToDelete
      ) {
        /*
         * The parent delete handler is async.
         *
         * `void` makes it explicit that this modal
         * intentionally does not wait for the Promise.
         *
         * This preserves the original behaviour:
         * click Delete -> modal closes immediately.
         */
        void onConfirmDelete(
          studentToDelete._id
        );
      }


      setShow(
        false
      );
    };


  return (
    <Modal
      show={show}
      onHide={
        handleClose
      }
      size="md"
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
            "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",

          color:
            "white",

          borderBottom:
            "none",

          borderRadius:
            "16px 16px 0 0",

          padding:
            "20px 24px",
        }}
      >
        <Modal.Title
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            fontSize:
              "22px",

            fontWeight:
              "600",
          }}
        >
          <WarningIcon
            sx={{
              fontSize:
                "32px",
            }}
          />

          Confirm Delete
        </Modal.Title>
      </Modal.Header>


      {/* ========================================
          BODY
      ======================================== */}

      <Modal.Body
        style={{
          padding:
            "24px",

          backgroundColor:
            "#f9fafb",
        }}
      >
        <div
          style={{
            textAlign:
              "center",
          }}
        >
          {/* ========================================
              CONFIRMATION MESSAGE
          ======================================== */}

          <h5
            style={{
              fontSize:
                "18px",

              fontWeight:
                "600",

              color:
                "#1f2937",

              marginBottom:
                "12px",
            }}
          >
            Are you sure you want to delete this student?
          </h5>


          {/* ========================================
              SELECTED STUDENT INFORMATION
          ======================================== */}

          {studentToDelete && (
            <div
              style={{
                backgroundColor:
                  "white",

                padding:
                  "16px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #e5e7eb",

                marginBottom:
                  "16px",
              }}
            >
              <p
                style={{
                  margin:
                    "4px 0",

                  fontSize:
                    "14px",

                  color:
                    "#6b7280",
                }}
              >
                <strong
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Name:
                </strong>{" "}

                {/*
                 * studentName is optional in our shared
                 * Student interface, so provide a useful
                 * fallback using firstName + lastName.
                 */}
                {studentToDelete.studentName ||
                  `${studentToDelete.firstName} ${studentToDelete.lastName}`.trim() ||
                  "-"}
              </p>


              <p
                style={{
                  margin:
                    "4px 0",

                  fontSize:
                    "14px",

                  color:
                    "#6b7280",
                }}
              >
                <strong
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Email:
                </strong>{" "}

                {studentToDelete.email ||
                  "-"}
              </p>


              <p
                style={{
                  margin:
                    "4px 0",

                  fontSize:
                    "14px",

                  color:
                    "#6b7280",
                }}
              >
                <strong
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  ID:
                </strong>{" "}

                {studentToDelete._id}
              </p>
            </div>
          )}


          {/* ========================================
              WARNING
          ======================================== */}

          <p
            style={{
              fontSize:
                "14px",

              color:
                "#dc2626",

              fontWeight:
                "500",

              marginBottom:
                "0",
            }}
          >
            ⚠️ This action cannot be undone.
          </p>
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
            "12px 20px",

          backgroundColor:
            "#ffffff",

          borderRadius:
            "0 0 16px 16px",

          gap:
            "8px",

          justifyContent:
            "center",
        }}
      >
        {/* Cancel */}

        <Button
          type="button"
          variant="secondary"
          onClick={
            handleClose
          }
          style={{
            backgroundColor:
              "white",

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
              "6px",

            minWidth:
              "100px",
          }}
        >
          Cancel
        </Button>


        {/* Confirm Delete */}

        <Button
          type="button"
          onClick={
            handleConfirm
          }
          disabled={
            !studentToDelete
          }
          style={{
            background:
              "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",

            border:
              "none",

            color:
              "white",

            fontWeight:
              "600",

            fontSize:
              "14px",

            padding:
              "8px 24px",

            borderRadius:
              "6px",

            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

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

export default ModalDeleteStudent;