import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalFooterBlockProps {
  /*
   * Called when the user clicks Cancel.
   */
  onClose: () => void;


  /*
   * Optional text shown on the submit button.
   *
   * Default:
   * "Save"
   */
  submitText?: string;


  /*
   * Optional text shown on the cancel button.
   *
   * Default:
   * "Cancel"
   */
  cancelText?: string;


  /*
   * TypeScript:
   * This should always be a boolean because
   * it directly controls the disabled state
   * of the submit button.
   */
  submitting?: boolean;


  /*
   * Allows different modals to override
   * the default submit-button gradient.
   */
  submitGradient?: string;
}


// ========================================
// COMPONENT
// ========================================

const ModalFooterBlock = ({
  onClose,

  submitText =
    "Save",

  cancelText =
    "Cancel",

  submitting =
    false,

  submitGradient =
    "linear-gradient(135deg, #3b82f6 0%, #0f54eb 100%)",
}: ModalFooterBlockProps) => {
  return (
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

        alignItems:
          "center",

        justifyContent:
          "flex-end",
      }}
    >
      {/* ========================================
          CANCEL BUTTON
      ======================================== */}

      <Button
        type="button"
        variant="secondary"
        onClick={
          onClose
        }
        style={{
          backgroundColor:
            "transparent",

          border:
            "1px solid #d1d5db",

          color:
            "#6b7280",

          fontWeight:
            700,

          fontSize:
            13,

          padding:
            "8px 16px",

          borderRadius:
            10,
        }}
      >
        {cancelText}
      </Button>


      {/* ========================================
          SUBMIT BUTTON
      ======================================== */}

      <Button
        type="submit"
        disabled={
          submitting
        }
        style={{
          background:
            submitGradient,

          border:
            "none",

          fontWeight:
            700,

          fontSize:
            13,

          padding:
            "8px 18px",

          borderRadius:
            10,

          boxShadow:
            "0 10px 22px rgba(37, 99, 235, 0.22)",
        }}
      >
        {submitText}
      </Button>
    </Modal.Footer>
  );
};

export default ModalFooterBlock;
