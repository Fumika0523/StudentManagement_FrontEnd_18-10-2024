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


/*
  A course option is used by the Autocomplete filter.

  Example:
    {
      label: "Web Development",
      id: "67abc123..."
    }
*/
interface CourseOption {
  label: string;
  id: string;
}


/*
  Represents the custom date range used by the filter.

  A date can be null because the user may not have
  selected a start or end date yet.
*/
interface DateRange {
  from: Date | null;
  to: Date | null;
}


/*
  This interface describes everything StudentFilter
  expects to receive from Header.tsx.

  TypeScript will now warn us if Header:
    - forgets a required prop
    - passes the wrong type
    - misspells a prop name
*/
interface StudentFilterProps {
  // Controls whether the filter panel is visible.
  openFilters: boolean;

  /*
    Setter belonging to:

      useState<boolean>()

    It allows:

      setOpenFilters(true)

    AND:

      setOpenFilters(previous => !previous)
  */
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    Functions from useFilteredTable.

    () => void means:
      no required arguments
      no return value that we use.
  */
  onApply: () => void;
  onReset: () => void;


  // -----------------------------
  // Course filter
  // -----------------------------

  uniqueCourses: CourseOption[];

  /*
    null means no course is currently selected.
  */
  selectedCourse: CourseOption | null;

  setSelectedCourse: Dispatch<
    SetStateAction<CourseOption | null>
  >;

  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Batch status filter
  // -----------------------------

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Student name filter
  // -----------------------------

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Gender filter
  // -----------------------------

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Session type filter
  // -----------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Date filter
  // -----------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;
}


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

  sessionType,
  setSessionType,

  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}: StudentFilterProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      {/* --------------------------------
          Filter Toggle Button
      -------------------------------- */}

      <Button
        variant="contained"

        /*
          setOpenFilters is a React boolean setter.

          We use its callback form:

            previousValue => !previousValue

          because the new value depends on
          the previous state.
        */
        onClick={() =>
          setOpenFilters(
            (previousOpen) => !previousOpen
          )
        }

        /*
          openFilters is boolean, so TypeScript
          knows which JSX icon should be rendered.
        */
        startIcon={
          openFilters ? (
            <Close />
          ) : (
            <FilterList />
          )
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


      {/* --------------------------------
          Collapsible Filter Panel
      -------------------------------- */}

      <Collapse
        in={openFilters}
        timeout={300}
        unmountOnExit
      >
        <Paper
          elevation={2}
          sx={filterPanelStyles}
        >
          {/* ----------------------------
              Filter input fields
          ---------------------------- */}

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


          {/* ----------------------------
              Reset / Apply buttons
          ---------------------------- */}

          <Box
            sx={
              filterActionsContainerStyles
            }
          >
            <Button
              variant="outlined"

              /*
                onReset has the type:

                  () => void

                so TypeScript knows this is
                a valid click handler.
              */
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


export default StudentFilter;