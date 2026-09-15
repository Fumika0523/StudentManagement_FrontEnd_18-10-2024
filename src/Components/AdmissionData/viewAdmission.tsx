import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import CustomisedAdmissionTable from "./CustomisedAdmissionTable";
import Header from "./Header/Header";

import {
  url,
} from "../utils/constant";

import {
  buildCourseOptions,
  equalsText,
  includesText,
  isWithinSelectedDateFilter,
  matchesSelectedCourse,
} from "../utils/filterUtils";

import type {
  CourseOption,
  DateRange,
} from "../utils/filterUtils";

import {
  useAuthConfig,
} from "../utils/useAuthConfig";

import {
  useFilteredTable,
} from "../utils/useFilteredTable";


// ========================================
// SHARED TYPES
// ========================================
//
// TypeScript:
// Instead of keeping all API data as untyped arrays,
// reuse the shared types we already created.

import type {
  Student,
  ComputedStudent,
} from "../../types/student";

import type {
  Course,
} from "../../types/course";

import type {
  Batch,
} from "../../types/batch";

import type {
  Admission,
} from "../../types/admission";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * TypeScript:
 * Axios can now know exactly what each backend route
 * returns instead of treating response.data as any.
 */

interface StudentListResponse {
  studentData: Student[];
}

interface CourseListResponse {
  courseData: Course[];
}

interface AdmissionListResponse {
  admissionData: Admission[];
}

interface BatchListResponse {
  batchData: Batch[];
}


// ========================================
// COMPONENT
// ========================================

const ViewAdmission = () => {
  // ========================================
  // DATE FILTER
  // ========================================

  const [
    datePreset,
    setDatePreset,
  ] = useState<string>("");


  /*
   * TypeScript:
   * DateRange comes from our shared filterUtils.
   *
   * Both values may initially be null because
   * the user has not selected dates yet.
   */
  const [
    dateRange,
    setDateRange,
  ] = useState<DateRange>({
    from: null,
    to: null,
  });


  // ========================================
  // API DATA
  // ========================================

  const [
    studentData,
    setStudentData,
  ] = useState<Student[]>([]);

  const [
    courseData,
    setCourseData,
  ] = useState<Course[]>([]);

  const [
    admissionData,
    setAdmissionData,
  ] = useState<Admission[]>([]);

  const [
    batchData,
    setBatchData,
  ] = useState<Batch[]>([]);


  // ========================================
  // FILTER PANEL
  // ========================================

  const [
    openFilters,
    setOpenFilters,
  ] = useState<boolean>(true);


  // ========================================
  // FILTER VALUES
  // ========================================

  const [
    studentName,
    setStudentName,
  ] = useState<string>("");

  const [
    genderFilter,
    setGenderFilter,
  ] = useState<string>("");

  const [
    sessionType,
    setSessionType,
  ] = useState<string>("");

  const [
    batchStatus,
    setBatchStatus,
  ] = useState<string>("");


  /*
   * TypeScript:
   * selectedCourse starts as null because nothing
   * has been selected in the Autocomplete yet.
   */
  const [
    selectedCourse,
    setSelectedCourse,
  ] = useState<CourseOption | null>(
    null
  );

  const [
    courseInput,
    setCourseInput,
  ] = useState<string>("");


  // ========================================
  // AUTH CONFIG
  // ========================================

  const config =
    useAuthConfig();


  // ========================================
  // FETCH BATCHES
  // ========================================

  const getBatchData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<BatchListResponse>(
            `${url}/allbatch`,
            config
          );

        setBatchData(
          response.data.batchData
        );
      },
      [config]
    );


  // ========================================
  // FETCH STUDENTS
  // ========================================

  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<StudentListResponse>(
            `${url}/all-student`,
            config
          );

        setStudentData(
          response.data.studentData
        );
      },
      [config]
    );


  // ========================================
  // FETCH COURSES
  // ========================================

  const getCourseData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<CourseListResponse>(
            `${url}/allcourse`,
            config
          );

        setCourseData(
          response.data.courseData
        );
      },
      [config]
    );


  // ========================================
  // FETCH ADMISSIONS
  // ========================================

  const getAdmissionData =
    useCallback(
      async (): Promise<void> => {
        const response =
          await axios.get<AdmissionListResponse>(
            `${url}/alladmission`,
            config
          );

        setAdmissionData(
          response.data.admissionData
        );
      },
      [config]
    );


  // ========================================
  // INITIAL DATA LOAD
  // ========================================

  useEffect(() => {
    /*
     * Keep the existing behaviour:
     * load all four datasets when this page opens.
     *
     * `void` tells TypeScript that we intentionally
     * start these async functions without awaiting
     * their return value inside useEffect.
     */
    void getStudentData();
    void getCourseData();
    void getAdmissionData();
    void getBatchData();
  }, [
    getAdmissionData,
    getBatchData,
    getCourseData,
    getStudentData,
  ]);


  // ========================================
  // COURSE FILTER OPTIONS
  // ========================================

  /*
   * buildCourseOptions<Course>() returns:
   *
   * {
   *   label: courseName,
   *   id: course._id
   * }
   */
  const uniqueCourses =
    useMemo<CourseOption[]>(() => {
      return buildCourseOptions(
        courseData
      );
    }, [courseData]);


  // ========================================
  // COMPUTED STUDENT ROWS
  // ========================================

  /*
   * The Admission page displays Students rather than
   * Admission documents directly.
   *
   * It enriches each Student with:
   *
   * computedBatchStatus
   * computedSessionType
   * computedCreatedAt
   *
   * These extra fields are represented by
   * ComputedStudent.
   */
  const computedRows =
    useMemo<ComputedStudent[]>(
      () => {
        // ----------------------------------------
        // Course lookup by MongoDB Course ID
        // ----------------------------------------

        const coursesById:
          Record<string, Course> = {};

        courseData.forEach(
          (course) => {
            coursesById[
              course._id
            ] = course;
          }
        );


        // ----------------------------------------
        // Batch lookup by batch number
        // ----------------------------------------

        const batchByNumber:
          Record<string, Batch> = {};

        batchData.forEach(
          (batch) => {
            if (
              batch.batchNumber
            ) {
              batchByNumber[
                batch.batchNumber
              ] = batch;
            }
          }
        );


        // ----------------------------------------
        // Current assigned batch for each student
        // ----------------------------------------

        /*
         * Example:
         *
         * {
         *   "Student One": "2026-001",
         *   "Student Two": "2026-002"
         * }
         */
        const assignedBatchByStudent:
          Record<
            string,
            string
          > = {};


        admissionData
          .filter(
            (admission) =>
              admission.status ===
              "Assigned"
          )
          .forEach(
            (admission) => {
              /*
               * batchNumber is optional according to the
               * backend Admission schema, so only store
               * records that actually contain one.
               */
              if (
                admission.studentName &&
                admission.batchNumber
              ) {
                assignedBatchByStudent[
                  admission.studentName
                ] =
                  admission.batchNumber;
              }
            }
          );


        // ----------------------------------------
        // Build computed Student rows
        // ----------------------------------------

        return studentData.map(
          (student) => {
            /*
             * student.courseId is optional in Student,
             * so check it before using it as an object key.
             */
            const course =
              student.courseId
                ? coursesById[
                    student.courseId
                  ]
                : undefined;


            /*
             * studentName is currently optional in the
             * shared Student type.
             */
            const assignedBatchNumber =
              student.studentName
                ? assignedBatchByStudent[
                    student.studentName
                  ]
                : undefined;


            const batch =
              assignedBatchNumber
                ? batchByNumber[
                    assignedBatchNumber
                  ]
                : undefined;


            return {
              ...student,

              /*
               * These three properties are frontend-only.
               * They are NOT added to MongoDB.
               */
              computedBatchStatus:
                batch?.status ?? "",

              computedSessionType:
                course?.courseType ??
                "",

              computedCreatedAt:
                student.createdAt ??
                "",
            };
          }
        );
      },
      [
        studentData,
        courseData,
        admissionData,
        batchData,
      ]
    );


  // ========================================
  // FILTER STUDENTS
  // ========================================

  const filterRows =
    useCallback(
      (
        rows:
          ComputedStudent[]
      ): ComputedStudent[] => {
        return rows.filter(
          (student) => {
            // Student name
            if (
              studentName.trim() &&
              !includesText(
                student.studentName,
                studentName
              )
            ) {
              return false;
            }


            // Gender
            if (
              genderFilter &&
              !equalsText(
                student.gender,
                genderFilter
              )
            ) {
              return false;
            }


            // Course
            if (
              !matchesSelectedCourse({
                row: student,
                selectedCourse,
                courseInput,
              })
            ) {
              return false;
            }


            // Batch status
            if (
              batchStatus &&
              !equalsText(
                student.computedBatchStatus,
                batchStatus
              )
            ) {
              return false;
            }


            // Session type
            if (
              sessionType &&
              !equalsText(
                student.computedSessionType,
                sessionType
              )
            ) {
              return false;
            }


            // Created date
            return isWithinSelectedDateFilter(
              student.computedCreatedAt,
              datePreset,
              dateRange
            );
          }
        );
      },
      [
        batchStatus,
        courseInput,
        datePreset,
        dateRange,
        genderFilter,
        selectedCourse,
        sessionType,
        studentName,
      ]
    );


  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters =
    useCallback((): void => {
      setStudentName("");

      setGenderFilter("");

      setDatePreset("");

      setDateRange({
        from: null,
        to: null,
      });

      setSessionType("");

      setSelectedCourse(
        null
      );

      setCourseInput("");

      setBatchStatus("");
    }, []);


  // ========================================
  // SHARED FILTERED TABLE HOOK
  // ========================================

  /*
   * TypeScript:
   * Explicitly tell the generic hook that this table
   * contains ComputedStudent rows.
   */
  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } =
    useFilteredTable<ComputedStudent>({
      rows: computedRows,
      filterRows,
      resetFilters,
    });


  return (
    <>
      <div className="py-2 border-4 border-danger row mx-auto w-100">
        {/* ========================================
            HEADER / FILTERS
        ======================================== */}

        <Header
          config={config}

          datePreset={
            datePreset
          }
          setDatePreset={
            setDatePreset
          }

          dateRange={
            dateRange
          }
          setDateRange={
            setDateRange
          }

          setStudentData={
            setStudentData
          }

          urlBase={url}

          openFilters={
            openFilters
          }
          setOpenFilters={
            setOpenFilters
          }

          onApply={
            applyFilters
          }
          onReset={
            resetTable
          }

          uniqueCourses={
            uniqueCourses
          }

          selectedCourse={
            selectedCourse
          }
          setSelectedCourse={
            setSelectedCourse
          }

          courseInput={
            courseInput
          }
          setCourseInput={
            setCourseInput
          }

          batchStatus={
            batchStatus
          }
          setBatchStatus={
            setBatchStatus
          }

          studentName={
            studentName
          }
          setStudentName={
            setStudentName
          }

          genderFilter={
            genderFilter
          }
          setGenderFilter={
            setGenderFilter
          }

          sessionType={
            sessionType
          }
          setSessionType={
            setSessionType
          }

          studentData={
            studentData
          }

          setAdmissionData={
            setAdmissionData
          }
          admissionData={
            admissionData
          }

      
        />


        {/* ========================================
            ADMISSION TABLE
        ======================================== */}

        {showTable && (
        <CustomisedAdmissionTable
  studentData={displayData}
  setStudentData={setStudentData}
  courseData={courseData}
  setCourseData={setCourseData}
  setAdmissionData={setAdmissionData}
  admissionData={admissionData}
  batchData={batchData}
/>
        )}
      </div>
    </>
  );
};

export default ViewAdmission;