import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Box,
  Button,
} from "@mui/material";

import axios from "axios";

import { RiFileEditFill } from "react-icons/ri";

import BulkUploadBtns from "../../Bulkload/BulkUploadBtns";

import ModalAddAdmission from "../Modal/CreateAdmission/ModalAddAdmission";


// ========================================
// SHARED TYPES
// ========================================

import type {
  Student,
} from "../../../types/student";

import type {
  Admission,
} from "../../../types/admission";


// ========================================
// API RESPONSE TYPE
// ========================================

/*
 * TypeScript:
 * After a successful bulk upload we refetch
 * all admissions from the backend.
 */
interface AdmissionListResponse {
  admissionData: Admission[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ActionBtnsProps {
  // Controls the Add Admission modal.
  showAdd: boolean;

  setShowAdd: Dispatch<
    SetStateAction<boolean>
  >;


  // Axios authentication configuration.
  config: AxiosRequestConfig;


  // Base backend URL passed from ViewAdmission.
  urlBase: string;


  // Student data required by ModalAddAdmission.
  studentData: Student[];

  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;


  // Admission data required by ModalAddAdmission.
  admissionData: Admission[];

  setAdmissionData: Dispatch<
    SetStateAction<Admission[]>
  >;
}


// ========================================
// COMPONENT
// ========================================

const ActionBtns = ({
  setShowAdd,
  showAdd,
  config,
  urlBase,
  studentData,
  setStudentData,
  setAdmissionData,
  admissionData,
}: ActionBtnsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {/* ========================================
          ADD ADMISSION BUTTON
      ======================================== */}

      <Button
        variant="contained"
        startIcon={
          <RiFileEditFill />
        }
        onClick={() =>
          setShowAdd(true)
        }
        sx={{
          backgroundColor:
            "#1f3fbf",

          textTransform:
            "none",

          fontWeight: 600,

          fontSize:
            "14px",

          px: 2.5,

          py: 1,

          borderRadius:
            "8px",

          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1)",

          transition:
            "all 0.2s ease",

          "&:hover": {
            backgroundColor:
              "#1b50c2",

            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)",

            transform:
              "translateY(-1px)",
          },
        }}
      >
        Add Admission
      </Button>


      {/* ========================================
          BULK UPLOAD
      ======================================== */}

      <BulkUploadBtns
        templateUrl="http://localhost:8001/api/excel/admission-template"
        importUrl="http://localhost:8001/api/excel/admission-import"
        modalTitle="Bulk Upload Admissions"
        axiosConfig={config}

        /*
         * After importing Admissions,
         * refresh the Admission list so the UI
         * immediately shows the uploaded records.
         */
        onRefresh={async (): Promise<void> => {
          const refreshed =
            await axios.get<AdmissionListResponse>(
              `${urlBase}/alladmission`,
              config
            );

          setAdmissionData(
            refreshed.data.admissionData
          );
        }}
      />


      {/* ========================================
          ADD ADMISSION MODAL
      ======================================== */}

      {showAdd && (
        <ModalAddAdmission
          show={showAdd}

          setShow={
            setShowAdd
          }

          setStudentData={
            setStudentData
          }

          setAdmissionData={
            setAdmissionData
          }

          admissionData={
            admissionData
          }

          studentData={
            studentData
          }
        />
      )}
    </Box>
  );
};

export default ActionBtns;