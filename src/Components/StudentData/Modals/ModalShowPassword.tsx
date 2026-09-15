import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Button,
} from "react-bootstrap";

import Modal from "react-bootstrap/Modal";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalShowPasswordProps {
  /*
   * Controls whether the Password modal
   * is currently visible.
   */
  viewPassword: boolean;

  setViewPassword: Dispatch<
    SetStateAction<boolean>
  >;


  /*
   * No password is selected when the modal
   * is closed, so null is allowed.
   */
  password: string | null;

  setPassword: Dispatch<
    SetStateAction<string | null>
  >;
}


// ========================================
// COMPONENT
// ========================================

const ModalShowPassword = ({
  viewPassword,
  setViewPassword,
  password,
  setPassword,
}: ModalShowPasswordProps) => {
  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setViewPassword(
        false
      );


      /*
       * TypeScript / cleanup:
       *
       * The old component received setPassword
       * but never used it.
       *
       * Clear the selected password when the
       * modal closes so stale data is not kept
       * in the parent state.
       */
      setPassword(
        null
      );


      /*
       * The old JavaScript component called:
       *
       * navigate("/studentdata")
       *
       * but `navigate` was never declared.
       *
       * Navigation is also unnecessary because
       * this modal already opens from Student Data.
       */
    };


  return (
    <Modal
      show={
        viewPassword
      }
      onHide={
        handleClose
      }
      size="lg"
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <Modal.Header
        closeButton
      >
        <Modal.Title>
          Password
        </Modal.Title>
      </Modal.Header>


      {/* ========================================
          PASSWORD
      ======================================== */}

      <Modal.Body>
        {password ??
          "No password available"}
      </Modal.Body>


      {/* ========================================
          FOOTER
      ======================================== */}

      <Modal.Footer>
        <Button
          type="button"
          variant="secondary"
          onClick={
            handleClose
          }
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalShowPassword;