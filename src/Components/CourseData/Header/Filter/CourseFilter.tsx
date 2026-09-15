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

import FilterFields from "./FilterFields";

import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

/*
  Reuse the shared Course interface.

  This means CourseFilter does not need to create
  its own Course definition.
*/
import type {
  Course,
} from "../../../../types/course";

/*
  Reuse the same DateRange type already used
  by ViewCourse.tsx and Header.tsx.
*/
import type {
  DateRange,
} from "../../../utils/filterUtils";


/*
  This interface describes all props that CourseFilter
  expects from CourseData/Header/Header.tsx.
*/
interface CourseFilterProps {
  // ---------------------------------
  // Filter panel
  // ---------------------------------

  /*
    Controls whether the filter panel is visible.
  */
  openFilters: boolean;

  /*
    React setter for boolean state.

    This allows:

      setOpenFilters(false)

    and also:

      setOpenFilters(
        previous => !previous
      )
  */
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    Functions coming from useFilteredTable().

    () => void means:
      - no arguments required
      - no meaningful return value
  */
  onApply: () => void;
  onReset: () => void;


  // ---------------------------------
  // Course Name
  // ---------------------------------

  courseName: string;

  setCourseName: Dispatch<
    SetStateAction<string>
  >;


  /*
    Full course data is passed down to FilterFields.

    FilterFields uses this to create the
    course-name options.
  */
  courseData: Course[];


  // ---------------------------------
  // Date Filter
  // ---------------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // ---------------------------------
  // Session Type
  // ---------------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


const CourseFilter = ({
  openFilters,
  setOpenFilters,

  onApply,
  onReset,

  courseName,
  setCourseName,

  courseData,

  datePreset,
  setDatePreset,

  dateRange,
  setDateRange,

  sessionType,
  setSessionType,
}: CourseFilterProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      {/* =====================================
          Filter Toggle Button
      ====================================== */}

      <Button
        variant="contained"

        /*
          Since the next state depends on the previous state,
          use the callback version of setOpenFilters.

          If previous value is:
            true  → false
            false → true
        */
        onClick={() =>
          setOpenFilters(
            (previousOpen) =>
              !previousOpen
          )
        }

        /*
          openFilters is boolean, so TypeScript
          knows which icon should be rendered.
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


      {/* =====================================
          Collapsible Filter Panel
      ====================================== */}

      <Collapse
        in={openFilters}
        timeout={300}
        unmountOnExit
      >
        <Paper
          elevation={2}
          sx={filterPanelStyles}
        >
          {/* ---------------------------------
              Filter Fields
          ---------------------------------- */}

          <Box
            sx={{
              p: 2,
              backgroundColor:
                "#f9fafb",
            }}
          >
            <FilterFields
              /*
                courseName is:
                  string

                setCourseName is:
                  Dispatch<SetStateAction<string>>
              */
              courseName={
                courseName
              }

              setCourseName={
                setCourseName
              }


              /*
                courseData is now properly typed as:
                  Course[]
              */
              courseData={
                courseData
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


          {/* ---------------------------------
              Reset / Apply Buttons
          ---------------------------------- */}

          <Box
            sx={
              filterActionsContainerStyles
            }
          >
            <Button
              variant="outlined"

              /*
                onReset has type:
                  () => void

                so it can be safely used as
                an onClick handler.
              */
              onClick={onReset}

              size="small"
              sx={resetButtonStyles}
            >
              Reset
            </Button>


            <Button
              variant="contained"

              /*
                onApply also has:
                  () => void
              */
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


export default CourseFilter;