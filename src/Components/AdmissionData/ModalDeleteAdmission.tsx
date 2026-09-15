import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import Modal from "react-bootstrap/Modal";
import {
  Button,
} from "react-bootstrap";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../utils/constant";

import type {
  Admission,
} from "../../types/admission";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * Response returned after deleting an admission.
 *
 * We only describe the property this component
 * currently uses.
 */
interface DeleteAdmissionResponse {
  deletedAdmission: Admission;
}


/*
 * Response returned when refreshing the
 * complete admission list.
 */
interface AdmissionListResponse {
  admissionData?: Admission[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalDeleteAdmissionProps {
  /*
   * Controls whether the confirmation modal
   * is currently visible.
   */
  viewWarning: boolean;

  setViewWarning:
    Dispatch<
      SetStateAction<boolean>
    >;


  /*
   * The admission selected for deletion.
   *
   * The existing component expects a valid
   * Admission when this modal is rendered.
   */
  singleAdmission: Admission;


  /*
   * Refreshes the admission list in the
   * parent component after deletion.
   */
  setAdmissionData:
    Dispatch<
      SetStateAction<Admission[]>
    >;
}


// ========================================
// COMPONENT
// ========================================

const ModalDeleteAdmission = ({
  viewWarning,
  setViewWarning,
  singleAdmission,
  setAdmissionData,
}: ModalDeleteAdmissionProps) => {
  const navigate =
    useNavigate();


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * Explicit AxiosRequestConfig typing gives
   * TypeScript a proper type for the request
   * headers passed to axios.
   */
  const config:
    AxiosRequestConfig = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setViewWarning(
        false
      );


      navigate(
        "/admissiondata"
      );
    };


  // ========================================
  // DELETE ADMISSION
  // ========================================

  const handleDeleteClick =
    async (
      id: string
    ): Promise<void> => {
      try {
        /*
         * Delete the selected admission.
         */
        const deleteResponse =
          await axios.delete<DeleteAdmissionResponse>(
            `${url}/deleteadmission/${id}`,
            config
          );


        /*
         * Refresh the complete admission list
         * after the delete succeeds.
         */
        const allResponse =
          await axios.get<AdmissionListResponse>(
            `${url}/alladmission`,
            config
          );


        setAdmissionData(
          allResponse.data.admissionData ??
            []
        );


        toast.error(
          `Admission for ${deleteResponse.data.deletedAdmission.studentName} has been deleted successfully!`,
          {
            style: {
              textWrap:
                "nowrap",

              textAlign:
                "center",

              fontSize:
                "14px",

              color:
                "black",
            },
          }
        );


        /*
         * Preserve the existing behaviour:
         * close the modal shortly after deletion.
         */
        window.setTimeout(
          () => {
            handleClose();
          },
          1000
        );
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript treats caught errors as
         * unknown, so narrow Axios errors before
         * reading Axios-specific properties.
         */
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Error Deleting Admission:",
            error.response?.data ??
              error.message
          );
        } else {
          console.error(
            "Error Deleting Admission:",
            error
          );
        }


        toast.error(
          "Failed to delete admission!"
        );
      }
    };


  // ========================================
  // UI
  // ========================================

  return (
    <Modal
      style={{
        marginTop:
          "15%",

        border:
          "none",
      }}
      show={
        viewWarning
      }
      onHide={
        handleClose
      }
    >
      <Modal.Title
        style={{
          padding:
            "10% 0%",
        }}
        className="text-center fs-3 border-none"
      >
        Are you sure you want to delete?
      </Modal.Title>


      <Modal.Body
        style={{
          padding:
            "10px",
        }}
        className="d-flex justify-content-center gap-5 border boder-warning mb-2 border-none"
      >
        <Button
          className="px-4 fs-5"
          style={{
            backgroundColor:
              "#2c51c1",
          }}
          onClick={() =>
            void handleDeleteClick(
              singleAdmission._id
            )
          }
        >
          Yes
        </Button>


        <Button
          className="px-4 fs-5"
          variant="secondary"
          onClick={
            handleClose
          }
        >
          No
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDeleteAdmission;