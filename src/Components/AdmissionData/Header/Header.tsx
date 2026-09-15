import {
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Box,
} from "@mui/material";

import ActionBtns from "./ActionBtns";
import AdmissionFilter from "./Filter/AdmissionFilter";


// ========================================
// SHARED TYPES
// ========================================

import type {
  Student,
} from "../../../types/student";

import type {
  Admission,
} from "../../../types/admission";

import type {
  CourseOption,
  DateRange,
} from "../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface HeaderProps {
  // ========================================
  // API / AUTH
  // ========================================

  /*
   * TypeScript:
   * Configuration returned by useAuthConfig().
   */
  config: AxiosRequestConfig;

  urlBase: string;


  // ========================================
  // FILTER PANEL
  // ========================================

  openFilters: boolean;

  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;

  onApply: () => void;

  onReset: () => void;


  // ========================================
  // COURSE FILTER
  // ========================================

  uniqueCourses: CourseOption[];

  selectedCourse:
    | CourseOption
    | null;

  setSelectedCourse: Dispatch<
    SetStateAction<
      CourseOption | null
    >
  >;

  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // OTHER FILTERS
  // ========================================

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // DATA REQUIRED BY ACTION BUTTONS
  // ========================================

  studentData: Student[];

  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;

  admissionData: Admission[];

  setAdmissionData: Dispatch<
    SetStateAction<Admission[]>
  >;
}


// ========================================
// COMPONENT
// ========================================

const Header = ({
  // API
  config,
  urlBase,

  // Filter panel
  openFilters,
  setOpenFilters,
  onApply,
  onReset,

  // Course filter
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,

  // Other filters
  batchStatus,
  setBatchStatus,

  studentName,
  setStudentName,

  genderFilter,
  setGenderFilter,

  datePreset,
  setDatePreset,

  dateRange,
  setDateRange,

  sessionType,
  setSessionType,

  // Data required by Add Admission
  studentData,
  setStudentData,

  admissionData,
  setAdmissionData,
}: HeaderProps) => {
  // ========================================
  // ADD ADMISSION MODAL
  // ========================================

  const [
    showAdd,
    setShowAdd,
  ] = useState<boolean>(false);


  return (
    <div>
      {/* ========================================
          TOP ACTION BUTTONS
      ======================================== */}

      <ActionBtns
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        config={config}
        urlBase={urlBase}
        studentData={studentData}
        setStudentData={setStudentData}
        setAdmissionData={setAdmissionData}
        admissionData={admissionData}
      />


      {/* ========================================
          FILTERS
      ======================================== */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          mt: 1,

          gap: 2,

          width: "100%",
        }}
      >
        <AdmissionFilter
          openFilters={openFilters}
          setOpenFilters={
            setOpenFilters
          }

          onApply={onApply}
          onReset={onReset}

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

          sessionType={
            sessionType
          }

          setSessionType={
            setSessionType
          }
        />
      </Box>
    </div>
  );
};

export default Header;