// src/components/StudentData/Modals/ModalDeleteStudent.jsx
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Warning as WarningIcon } from "@mui/icons-material";

/**
 * Delete Student Confirmation Modal
 * Beautiful, modern confirmation dialog with red gradient
 */
function ModalDeleteStudent({ 
  show, 
  setShow, 
  studentToDelete, 
  onConfirmDelete 
}) {
  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    if (studentToDelete) {
      onConfirmDelete(studentToDelete._id);
    }
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      style={{ "--bs-modal-border-radius": "16px" }}
    >
      {/* Header with red gradient for warning */}
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
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
          <WarningIcon sx={{ fontSize: "32px" }} />
          Confirm Delete
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "24px", backgroundColor: "#f9fafb" }}>
        <div style={{ textAlign: "center" }}>
          {/* Warning Icon */}
          {/* <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <WarningIcon sx={{ fontSize: "48px", color: "#dc2626" }} />
          </div> */}

          {/* Message */}
          <h5
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            Are you sure you want to delete this student?
          </h5>

          {/* Student Info */}
          {studentToDelete && (
            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "16px",
              }}
            >
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
                <strong style={{ color: "#374151" }}>Name:</strong>{" "}
                {studentToDelete.studentName}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
                <strong style={{ color: "#374151" }}>Email:</strong>{" "}
                {studentToDelete.email}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
                <strong style={{ color: "#374151" }}>ID:</strong>{" "}
                {studentToDelete._id}
              </p>
            </div>
          )}

          {/* Warning Text */}
          <p
            style={{
              fontSize: "14px",
              color: "#dc2626",
              fontWeight: "500",
              marginBottom: "0",
            }}
          >
            ⚠️ This action cannot be undone.
          </p>
        </div>
      </Modal.Body>

      {/* Footer with styled buttons */}
      <Modal.Footer
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "12px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "0 0 16px 16px",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <Button
          variant="secondary"
          onClick={handleClose}
          style={{
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            color: "#6b7280",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 24px",
            borderRadius: "6px",
            minWidth: "100px",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            border: "none",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 24px",
            borderRadius: "6px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            minWidth: "100px",
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeleteStudent;