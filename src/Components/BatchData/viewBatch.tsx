import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

import CustomisedBatchTables from "./CustomisedBatchTables";
import BatchHeader from "./Header/BatchHeader";

import { url } from "../utils/constant";
import { includesText } from "../utils/filterUtils";
import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

// TypeScript:
// Reuse the shared types we already created instead of
// describing Batch/Course objects again inside this component.
import type {
  Batch,
  BatchStatus,
} from "../../types/batch";

import type { Course } from "../../types/course";


// ========================================
// API RESPONSE TYPES
// ========================================

// TypeScript:
// Axios does not automatically know the shape of res.data,
// so we describe the response returned by each endpoint.

interface BatchListResponse {
  batchData: Batch[];
}

interface CourseListResponse {
  courseData: Course[];
}

/*
 * Student and Admission are only fetched here and passed
 * directly to child components.
 *
 * This component does not access their properties itself,
 * so we do not create duplicate Student/Admission interfaces
 * just for this file.
 *
 * We can replace these unknown[] types with their proper
 * shared types when those Batch child components are migrated.
 */
interface StudentListResponse {
  studentData: unknown[];
}

interface AdmissionListResponse {
  admissionData: unknown[];
}


function ViewBatch() {
  // ========================================
  // DATA STATES
  // ========================================

  // TypeScript:
  // Without <Batch[]> TypeScript would infer never[]
  // or an overly broad array type from the empty array.
  const [batchData, setBatchData] =
    useState<Batch[]>([]);

  const [courseData, setCourseData] =
    useState<Course[]>([]);

  /*
   * These are currently pass-through data.
   * Their detailed types will be tightened when we migrate
   * the Batch components that actually read their fields.
   */
  const [studentData, setStudentData] =
    useState<unknown[]>([]);

  const [admissionData, setAdmissionData] =
    useState<unknown[]>([]);


  // ========================================
  // FILTER STATES
  // ========================================

  const [batchNumber, setBatchNumber] =
    useState<string>("");

  const [courseName, setCourseName] =
    useState<string>("");

  const [location, setLocation] =
    useState<string>("");

  const [createdBy, setCreatedBy] =
    useState<string>("");

  const [status, setStatus] =
    useState<string>("");

  const [sessionType, setSessionType] =
    useState<string>("");

  const [sessionDay, setSessionDay] =
    useState<string>("");


  // ========================================
  // UI STATES
  // ========================================

  const [openFilters, setOpenFilters] =
    useState<boolean>(true);

  const config = useAuthConfig();


  // ========================================
  // FETCH STUDENTS
  // ========================================

  const getStudentData = useCallback(
    async (): Promise<void> => {
      try {
        /*
         * TypeScript:
         * Passing StudentListResponse to axios.get tells TS
         * exactly what res.data should contain.
         */
        const res =
          await axios.get<StudentListResponse>(
            `${url}/all-student`,
            config
          );

        setStudentData(
          res.data.studentData
        );
      } catch (error: unknown) {
        /*
         * TypeScript:
         * catch values are treated as unknown because
         * JavaScript can technically throw anything.
         */
        console.error(
          "Error fetching students:",
          error
        );
      }
    },
    [config]
  );


  // ========================================
  // FETCH BATCHES
  // ========================================

  const getBatchData = useCallback(
    async (): Promise<void> => {
      try {
        const res =
          await axios.get<BatchListResponse>(
            `${url}/allbatch`,
            config
          );

        setBatchData(
          res.data.batchData
        );
      } catch (error: unknown) {
        console.error(
          "Error fetching batches:",
          error
        );
      }
    },
    [config]
  );


  // ========================================
  // FETCH ADMISSIONS
  // ========================================

  const getAdmissionData = useCallback(
    async (): Promise<void> => {
      try {
        const res =
          await axios.get<AdmissionListResponse>(
            `${url}/alladmission`,
            config
          );

        setAdmissionData(
          res.data.admissionData
        );
      } catch (error: unknown) {
        console.error(
          "Error fetching admissions:",
          error
        );
      }
    },
    [config]
  );


  // ========================================
  // FETCH COURSES
  // ========================================

  const getCourseData = useCallback(
    async (): Promise<void> => {
      try {
        const res =
          await axios.get<CourseListResponse>(
            `${url}/allcourse`,
            config
          );

        setCourseData(
          res.data.courseData
        );
      } catch (error: unknown) {
        console.error(
          "Error fetching courses:",
          error
        );
      }
    },
    [config]
  );


  // ========================================
  // INITIAL DATA FETCH
  // ========================================

  useEffect(() => {
    getAdmissionData();
    getBatchData();
    getStudentData();
    getCourseData();
  }, [
    getAdmissionData,
    getBatchData,
    getCourseData,
    getStudentData,
  ]);


  // ========================================
  // COMPUTE BATCH STATUS
  // ========================================

  /*
   * TypeScript:
   * batch must be a Batch.
   *
   * course can be undefined because Array.find()
   * returns undefined when no matching course exists.
   *
   * The function can only return one of our valid
   * BatchStatus values.
   */
  const computeStatus = (
    batch: Batch,
    course?: Course
  ): BatchStatus => {
    if (
      batch.status ===
      "Batch Completed"
    ) {
      return "Batch Completed";
    }

    /*
     * Number() makes this safe even if noOfDays comes
     * from the API as a numeric-looking value.
     */
    const numberOfDays =
      Number(course?.noOfDays);

    if (
      !batch.startDate ||
      !course ||
      !Number.isFinite(numberOfDays) ||
      numberOfDays <= 0
    ) {
      return (
        batch.status ||
        "Not Started"
      );
    }

    const startDate =
      new Date(batch.startDate);

    const endDate =
      new Date(
        startDate.getTime() +
          numberOfDays *
            24 *
            60 *
            60 *
            1000
      );

    const today =
      new Date();

    if (today < startDate) {
      return "Not Started";
    }

    if (
      today >= startDate &&
      today < endDate
    ) {
      return "In Progress";
    }

    return "Training Completed";
  };


  // ========================================
  // FILTER BATCHES
  // ========================================

  const filterRows = useCallback(
    (rows: Batch[]): Batch[] => {
      return rows.filter(
        (batch: Batch) => {
          if (
            batchNumber.trim() &&
            !includesText(
              batch.batchNumber,
              batchNumber
            )
          ) {
            return false;
          }

          if (
            courseName.trim() &&
            !includesText(
              batch.courseName,
              courseName
            )
          ) {
            return false;
          }

          /*
           * location is optional in our Batch type because
           * the frontend uses it but the current Mongoose
           * Batch schema does not officially define it.
           *
           * includesText already safely handles missing values.
           */
          if (
            location.trim() &&
            !includesText(
              batch.location,
              location
            )
          ) {
            return false;
          }

          /*
           * Same situation for createdBy:
           * currently used by the frontend but not declared
           * in the backend Batch schema.
           */
          if (
            createdBy.trim() &&
            !includesText(
              batch.createdBy,
              createdBy
            )
          ) {
            return false;
          }

          if (status) {
            /*
             * TypeScript:
             * Array.find returns Course | undefined,
             * which is why computeStatus accepts an
             * optional course.
             */
            const course =
              courseData.find(
                (course) =>
                  course.courseName ===
                  batch.courseName
              );

            const computedStatus =
              computeStatus(
                batch,
                course
              );

            if (
              computedStatus !==
              status
            ) {
              return false;
            }
          }

          if (
            sessionType &&
            batch.sessionType !==
              sessionType
          ) {
            return false;
          }

          if (
            sessionDay &&
            batch.sessionDay !==
              sessionDay
          ) {
            return false;
          }

          return true;
        }
      );
    },
    [
      batchNumber,
      courseName,
      location,
      createdBy,
      status,
      sessionType,
      sessionDay,
      courseData,
    ]
  );


  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters =
    useCallback((): void => {
      setBatchNumber("");
      setCourseName("");
      setLocation("");
      setCreatedBy("");
      setStatus("");
      setSessionType("");
      setSessionDay("");
    }, []);


  // ========================================
  // SHARED FILTER TABLE HOOK
  // ========================================

  /*
   * Because rows is Batch[] and filterRows accepts Batch[],
   * our migrated useFilteredTable utility can infer that
   * displayData is also Batch[].
   */
  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable({
    rows: batchData,
    filterRows,
    resetFilters,
  });


  return (
    <Box className="py-2 row mx-auto w-100">
      {/* Header with Filters and Action Button */}
      <BatchHeader
        openFilters={openFilters}
        setOpenFilters={
          setOpenFilters
        }
        onApply={applyFilters}
        onReset={resetTable}
        batchNumber={batchNumber}
        setBatchNumber={
          setBatchNumber
        }
        courseName={courseName}
        setCourseName={
          setCourseName
        }
        location={location}
        setLocation={setLocation}
        createdBy={createdBy}
        setCreatedBy={
          setCreatedBy
        }
        status={status}
        setStatus={setStatus}
        sessionType={sessionType}
        setSessionType={
          setSessionType
        }
        sessionDay={sessionDay}
        setSessionDay={
          setSessionDay
        }
        batchData={batchData}
        courseData={courseData}
        setBatchData={
          setBatchData
        }
      />

      {/* Table - Only show when showTable is true */}
      {showTable ? (
        <CustomisedBatchTables
          setAdmissionData={
            setAdmissionData
          }
          admissionData={
            admissionData
          }
          setBatchData={
            setBatchData
          }
          batchData={
            displayData
          }
          studentData={
            studentData
          }
          setStudentData={
            setStudentData
          }
          courseData={
            courseData
          }
          setCourseData={
            setCourseData
          }
        />
      ) : (
        <Box
          sx={{
            mt: 3,
            p: 4,
            textAlign: "center",
            backgroundColor:
              "#f8fafc",
            borderRadius: "12px",
            border:
              "2px dashed #cbd5e1",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              mb: 1,
            }}
          >
            No filters applied
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
            }}
          >
            Please select filters and
            click Apply Filters to view
            batches
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ViewBatch;