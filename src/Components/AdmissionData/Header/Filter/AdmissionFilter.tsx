import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Box,
  Button,
  Collapse,
  Paper,
} from "@mui/material";

import {
  FilterList,
  Close,
} from "@mui/icons-material";

import FilterFields from "./FilterFileds";

import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

import type {
  CourseOption,
  DateRange,
} from "../../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface AdmissionFilterProps {
  // Controls whether the filter panel is open.
  openFilters: boolean;

  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  // Called when the user applies or resets filters.
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
  // BATCH STATUS FILTER
  // ========================================

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // STUDENT FILTER
  // ========================================

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // GENDER FILTER
  // ========================================

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // DATE FILTER
  // ========================================

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // ========================================
  // SESSION TYPE FILTER
  // ========================================

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


// ========================================
// COMPONENT
// ========================================

const AdmissionFilter = ({
  openFilters,
  setOpenFilters,

  onApply,
  onReset,

  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,

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
}: AdmissionFilterProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      {/* ========================================
          FILTER TOGGLE BUTTON
      ======================================== */}

      <Button
        variant="contained"
        onClick={() =>
          setOpenFilters(
            (previous) =>
              !previous
          )
        }
        startIcon={
          openFilters
            ? <Close />
            : <FilterList />
        }
        sx={
          filterToggleButtonStyles(
            openFilters
          )
        }
      >
        {openFilters
          ? "Hide Filters"
          : "Show Filters"}
      </Button>


      {/* ========================================
          FILTER PANEL
      ======================================== */}

      <Collapse
        in={openFilters}
        timeout={300}
        unmountOnExit
      >
        <Paper
          elevation={2}
          sx={filterPanelStyles}
        >
          {/* ========================================
              FILTER FIELDS
          ======================================== */}

          <Box
            sx={
              filterFieldsContainerStyles
            }
          >
            <FilterFields
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
            />
          </Box>


          {/* ========================================
              FILTER ACTION BUTTONS
          ======================================== */}

          <Box
            sx={
              filterActionsContainerStyles
            }
          >
            <Button
              variant="outlined"
              onClick={onReset}
              size="small"
              sx={resetButtonStyles}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              onClick={onApply}
              size="small"
              sx={applyButtonStyles}
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default AdmissionFilter;