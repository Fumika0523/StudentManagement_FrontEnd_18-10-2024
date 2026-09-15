import type {
  Dispatch,
  SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { url } from "../../utils/constant";

// TypeScript:
// Reuse the shared Batch type instead of
// defining the batch structure again here.
import type { Batch } from "../../../types/batch";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalDeleteWarningProps {
  // Controls whether the confirmation modal is visible.
  viewWarning: boolean;

  // React state setter from CustomisedBatchTables.
  setViewWarning: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * TypeScript:
   * CustomisedBatchTables only renders this modal when
   * singleBatch is definitely not null:
   *
   * {viewWarning && singleBatch && (...)}
   *
   * so this component can safely require Batch.
   */
  singleBatch: Batch;

  // Used to refresh the main Batch data after deletion.
  setBatchData: Dispatch<
    SetStateAction<Batch[]>
  >;
}


// ========================================
// API RESPONSE TYPE
// ========================================

interface BatchListResponse {
  batchData: Batch[];
}


const ModalDeleteWarning = ({
  viewWarning,
  setViewWarning,
  singleBatch,
  setBatchData,
}: ModalDeleteWarningProps) => {
  const navigate =
    useNavigate();


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose = (): void => {
    setViewWarning(false);

    navigate("/batchdata");
  };


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };


  // ========================================
  // DELETE BATCH
  // ========================================

  /*
   * TypeScript:
   * MongoDB IDs are strings in our Batch type,
   * so the delete handler explicitly accepts string.
   */
  const handleDeleteClick = async (
    id: string
  ): Promise<void> => {
    try {
      /*
       * Keep the existing backend endpoint unchanged
       * during the TypeScript migration.
       */
      await axios.delete(
        `${url}/deletesbatch/${id}`,
        config
      );

      /*
       * After deleting, refetch all Batch data so
       * the main table immediately reflects the change.
       */
      const response =
        await axios.get<BatchListResponse>(
          `${url}/allbatch`,
          config
        );

      setBatchData(
        response.data.batchData
      );

      handleClose();
    } catch (error: unknown) {
      /*
       * TypeScript:
       * catch values are unknown, so we don't assume
       * that the error is automatically an Axios error.
       */
      if (
        axios.isAxiosError(
          error
        )
      ) {
        console.error(
          "Error Deleting Batch:",
          error.response?.data ||
            error.message
        );

        return;
      }

      console.error(
        "Error Deleting Batch:",
        error
      );
    }
  };


  return (
    <Modal
      show={viewWarning}
      onHide={handleClose}
    >
      <Modal.Body
        style={{
          padding: "5%",
        }}
        className="d-flex justify-content-center border boder-warning mb-2 gap-5 border-none"
      >
        Are you sure you want to delete?
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="px-4 fs-5"
          style={{
            backgroundColor:
              "#4e73df",
          }}
          /*
           * TypeScript already knows singleBatch._id
           * is a string from the shared Batch type.
           */
          onClick={() =>
            void handleDeleteClick(
              singleBatch._id
            )
          }
        >
          Yes
        </Button>

        <Button
          className="px-4 fs-5"
          variant="secondary"
          onClick={handleClose}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteWarning;
