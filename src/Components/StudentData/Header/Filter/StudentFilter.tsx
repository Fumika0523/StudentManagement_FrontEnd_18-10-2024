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
  Close,
  FilterList,
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

interface StudentFilterProps {
  // ----------------------------------------
  // FILTER PANEL
  // ----------------------------------------

  openFilters: boolean;

  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  // ----------------------------------------
  // FILTER ACTIONS
  // ----------------------------------------

  /*
   * These functions are supplied by ViewStudent
   * through useFilteredTable.
   */
  onApply: () => void;

  onReset: () => void;


  // ----------------------------------------
  // COURSE FILTER
  // ----------------------------------------

  uniqueCourses: CourseOption[];

  selectedCourse: CourseOption | null;

  setSelectedCourse: Dispatch<
    SetStateAction<CourseOption | null>
  >;

  /*
   * freeSolo text is stored separately from the
   * selected CourseOption object.
   */
  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // ----------------------------------------
  // BATCH STATUS
  // ----------------------------------------

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // ----------------------------------------
  // STUDENT NAME
  // ----------------------------------------

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // ----------------------------------------
  // GENDER
  // ----------------------------------------

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // ----------------------------------------
  // DATE FILTER
  // ----------------------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // ----------------------------------------
  // SESSION TYPE
  // ----------------------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


// ========================================
// COMPONENT
// ========================================

const StudentFilter = ({
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
}: StudentFilterProps) => {
  // ========================================
  // TOGGLE FILTER PANEL
  // ========================================

  const handleToggleFilters =
    (): void => {
      /*
       * Functional state update preserves the
       * existing behaviour and gives TypeScript
       * the previous value as a boolean.
       */
      setOpenFilters(
        (
          previous
        ) =>
          !previous
      );
    };


  return (
    <Box
      sx={{
        width:
          "100%",

        mb:
          2,
      }}
    >
      {/* ========================================
          SHOW / HIDE FILTERS
      ======================================== */}

      <Button
        variant="contained"
        onClick={
          handleToggleFilters
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
        in={
          openFilters
        }
        timeout={
          300
        }
        unmountOnExit
      >
        <Paper
          elevation={
            2
          }
          sx={
            filterPanelStyles
          }
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
              type="button"
              variant="outlined"
              onClick={
                onReset
              }
              size="small"
              sx={
                resetButtonStyles
              }
            >
              Reset
            </Button>


            <Button
              type="button"
              variant="contained"
              onClick={
                onApply
              }
              size="small"
              sx={
                applyButtonStyles
              }
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default StudentFilter;