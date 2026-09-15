import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


/*
  Props expected by the reusable modal footer.

  This component is used by multiple forms/modals,
  so typing it once helps all of them.
*/
interface ModalFooterBlockProps {
  /*
    Function called when the Cancel button is clicked.

    () => void means:
      - no arguments are required
      - no useful return value is expected
  */
  onClose: () => void;


  /*
    Optional text shown on the submit button.

    `?` means the prop does not have to be provided.

    If it is missing, we use:
      "Save"
  */
  submitText?: string;


  /*
    Optional text shown on the cancel button.

    Default:
      "Cancel"
  */
  cancelText?: string;


  /*
    Used to disable the submit button while
    an async form submission is in progress.

    Example:
      submitting={formik.isSubmitting}
  */
  submitting?: boolean;


  /*
    Optional CSS gradient for the submit button.

    Example:
      linear-gradient(...)
  */
  submitGradient?: string;
}


function ModalFooterBlock({
  onClose,

  /*
    These default values are used if the parent
    does not provide the optional props.
  */
  submitText = "Save",
  cancelText = "Cancel",
  submitting = false,

  submitGradient =
    "linear-gradient(135deg, #3b82f6 0%, #0f54eb 100%)",
}: ModalFooterBlockProps) {
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

        gap: 10,

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "flex-end",
      }}
    >
      {/* =====================================
          Cancel Button
      ====================================== */}

      <Button
        variant="secondary"

        /*
          onClose has the type:

            () => void

          so it is valid to use directly
          as this button's click handler.
        */
        onClick={onClose}

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


      {/* =====================================
          Submit Button
      ====================================== */}

      <Button
        /*
          Because this button is inside a <form>,
          type="submit" triggers the form's onSubmit handler.
        */
        type="submit"

        /*
          submitting is boolean.

          true  → button disabled
          false → button enabled
        */
        disabled={submitting}

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
}


export default ModalFooterBlock;