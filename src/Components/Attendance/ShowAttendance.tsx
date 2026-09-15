import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import type {
  SelectChangeEvent,
} from "@mui/material";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import axios from "axios";

import AttendanceTable from "./AttendanceTable";

import {
  url,
} from "../utils/constant";

import type {
  Student,
} from "../../types/student";

import type {
  Batch,
} from "../../types/batch";


// ========================================
// API RESPONSE TYPES
// ========================================

interface BatchListResponse {
  batchData: Batch[];
}


interface StudentListResponse {
  studentData: Student[];
}


// ========================================
// COMPONENT
// ========================================

const ShowAttendance = () => {
  // ========================================
  // DATA STATE
  // ========================================

  const [
    batchData,
    setBatchData,
  ] =
    useState<Batch[]>(
      []
    );


  const [
    studentData,
    setStudentData,
  ] =
    useState<Student[]>(
      []
    );


  // ========================================
  // SELECTED BATCH
  // ========================================

  /*
   * The old JSX already created selectedBatch,
   * but its Select value/onChange were commented out.
   *
   * We now connect them properly so TypeScript does
   * not leave unused state and the dropdown remains
   * controlled.
   */
  const [
    selectedBatch,
    setSelectedBatch,
  ] =
    useState<string>(
      ""
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * Memoize the Axios config so it remains stable
   * between renders unless the token changes.
   */
  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [
        token,
      ]
    );


  // ========================================
  // FETCH BATCH DATA
  // ========================================

  const getBatchData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<BatchListResponse>(
              `${url}/allbatch`,
              config
            );


          setBatchData(
            response.data.batchData
          );
        } catch (
          error: unknown
        ) {
          /*
           * catch values are unknown in TypeScript.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Error fetching batch data:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching batch data:",
            error
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // FETCH STUDENT DATA
  // ========================================

  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<StudentListResponse>(
              `${url}/all-student`,
              config
            );


          setStudentData(
            response.data.studentData
          );
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Error fetching student data:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching student data:",
            error
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // INITIAL DATA LOAD
  // ========================================

  useEffect(() => {
    void getBatchData();

    void getStudentData();
  }, [
    getBatchData,
    getStudentData,
  ]);


  // ========================================
  // BATCH SELECT HANDLER
  // ========================================

  const handleBatchChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    setSelectedBatch(
      event.target.value
    );
  };


  // ========================================
  // SHOW RECORD
  // ========================================

  const handleShowRecord =
    (): void => {
      /*
       * The original component does not yet have
       * an API or filtering implementation for
       * "Show Record".
       *
       * Keep this handler intentionally empty for
       * now rather than inventing new behaviour
       * during the TypeScript migration.
       */
      console.log(
        "Selected batch:",
        selectedBatch
      );
    };


  return (
    <div className="py-2 border-4 border-danger row mx-auto w-100">
      {/* ========================================
          ATTENDANCE CONTROLS
      ======================================== */}

      <div className="d-flex flex-row align-items-center justify-content-between">
        {/* ========================================
            BATCH SELECT
        ======================================== */}

        <Box
          sx={{
            flex:
              "1 1 220px",

            minWidth:
              180,

            maxWidth:
              300,
          }}
        >
          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Select Batch
            </InputLabel>


            <Select<string>
              value={
                selectedBatch
              }
              onChange={
                handleBatchChange
              }
              label="Select Batch"
            >
              {batchData.map(
                (
                  batch
                ) => (
                  <MenuItem
                    key={
                      batch._id
                    }
                    value={
                      batch.batchNumber
                    }
                  >
                    {batch.batchNumber}
                  </MenuItem>
                )
              )}


              {batchData.length ===
                0 && (
                <MenuItem
                  disabled
                >
                  No active batches found
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>


        {/* ========================================
            SHOW RECORD
        ======================================== */}

        <div>
          <Button
            type="button"
            onClick={
              handleShowRecord
            }
            disabled={
              !selectedBatch
            }
          >
            Show Record
          </Button>
        </div>


        {/* ========================================
            QUICK DATE BUTTONS
        ======================================== */}

        <div>
          {/*
           * These buttons existed in the old JSX,
           * but no filtering logic has been
           * implemented yet.
           */}

          <Button
            type="button"
          >
            Last 7 days
          </Button>

          <Button
            type="button"
          >
            Last 30 days
          </Button>
        </div>
      </div>


      {/* ========================================
          ATTENDANCE TABLE
      ======================================== */}

      <AttendanceTable
        studentData={
          studentData
        }
      />
    </div>
  );
};

export default ShowAttendance;