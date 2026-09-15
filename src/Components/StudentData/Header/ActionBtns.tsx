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

import {
  PersonAdd,
} from "@mui/icons-material";

import axios from "axios";

import BulkUploadBtns from "../../Bulkload/BulkUploadBtns";

import type {
  Student,
} from "../../../types/student";


// ========================================
// API RESPONSE TYPE
// ========================================

interface StudentListResponse {
  studentData: Student[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ActionBtnsProps {
  /*
   * Controls the Add Student modal
   * in Header.tsx.
   */
  setShowAdd: Dispatch<
    SetStateAction<boolean>
  >;


  /*
   * Authenticated Axios configuration
   * supplied by ViewStudent.
   */
  config: AxiosRequestConfig;


  /*
   * Used after a successful bulk upload/delete
   * to refresh the Student table.
   */
  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;


  /*
   * API base URL.
   *
   * Example:
   * http://localhost:8001
   */
  urlBase: string;
}


// ========================================
// COMPONENT
// ========================================

const ActionBtns = ({
  setShowAdd,
  config,
  setStudentData,
  urlBase,
}: ActionBtnsProps) => {
  // ========================================
  // OPEN ADD STUDENT MODAL
  // ========================================

  const handleAddStudent =
    (): void => {
      setShowAdd(
        true
      );
    };


  // ========================================
  // REFRESH STUDENT DATA
  // ========================================

  const refreshStudentData =
    async (): Promise<void> => {
      /*
       * TypeScript:
       * Axios receives the expected response
       * shape so response.data.studentData
       * becomes Student[] automatically.
       */
      const refreshed =
        await axios.get<StudentListResponse>(
          `${urlBase}/all-student`,
          config
        );


      setStudentData(
        refreshed.data.studentData
      );
    };


  return (
    <Box
      sx={{
        display:
          "flex",

        flexWrap:
          "wrap",

        gap:
          1.5,

        mb:
          1,

        justifyContent:
          "flex-end",

        alignItems:
          "center",
      }}
    >
      {/* ========================================
          ADD STUDENT
      ======================================== */}

      <Button
        type="button"
        variant="contained"
        startIcon={
          <PersonAdd />
        }
        onClick={
          handleAddStudent
        }
        sx={{
          backgroundColor:
            "#1f3fbf",

          textTransform:
            "none",

          fontWeight:
            600,

          fontSize:
            "14px",

          px:
            2.5,

          py:
            1,

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
        Add Student
      </Button>


      {/* ========================================
          BULK UPLOAD / DELETE
      ======================================== */}

      <BulkUploadBtns
        templateUrl="http://localhost:8001/api/excel/student-template"
        importUrl="http://localhost:8001/api/excel/student-add-update"
        deleteUrl="http://localhost:8001/api/excel/student-delete"
        modalTitle="Bulk Upload Students"
        /*
         * BulkUploadBtns.tsx now gets its own
         * authentication token internally.
         *
         * The old axiosConfig={config} prop has
         * therefore been removed because it is
         * no longer part of that component's props.
         */
        onRefresh={
          refreshStudentData
        }
      />
    </Box>
  );
};

export default ActionBtns;