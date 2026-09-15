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

import TaskFilterFields from "./TaskFilterFields";

import {
  applyButtonStyles,
  filterActionsContainerStyles,
  filterFieldsContainerStyles,
  filterPanelStyles,
  filterToggleButtonStyles,
  resetButtonStyles,
} from "../../../utils/constant";

import type {
  CourseOption,
  DateRange,
} from "../../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface TaskFilterProps {
  // Controls whether the filter panel is visible.
  openFilters: boolean;

  setOpenFilters:
    Dispatch<
      SetStateAction<boolean>
    >;


  // Called by the Apply and Reset buttons.
  onApply: () => void;

  onReset: () => void;


  // ========================================
  // COURSE FILTER
  // ========================================

  /*
   * Reuse the existing shared CourseOption type
   * used by our other filter components.
   */
  uniqueCourses: CourseOption[];

  selectedCourse:
    CourseOption | null;

  setSelectedCourse:
    Dispatch<
      SetStateAction<
        CourseOption | null
      >
    >;

  /*
   * freeSolo input text is kept separately
   * from selectedCourse.
   */
  courseInput: string;

  setCourseInput:
    Dispatch<
      SetStateAction<string>
    >;


  // ========================================
  // BATCH FILTER
  // ========================================

  batchNumberFilter:
    string;

  setBatchNumberFilter:
    Dispatch<
      SetStateAction<string>
    >;


  // ========================================
  // DATE FILTER
  // ========================================

  datePreset: string;

  setDatePreset:
    Dispatch<
      SetStateAction<string>
    >;

  /*
   * DateRange comes from the shared
   * filterUtils.ts type definition.
   */
  dateRange: DateRange;

  setDateRange:
    Dispatch<
      SetStateAction<DateRange>
    >;
}


// ========================================
// COMPONENT
// ========================================

const TaskFilter = ({
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  batchNumberFilter,
  setBatchNumberFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}: TaskFilterProps) => {
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
          FILTER TOGGLE BUTTON
      ======================================== */}

      <Button
        variant="contained"
        onClick={() =>
          setOpenFilters(
            (
              currentValue
            ) =>
              !currentValue
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
            <TaskFilterFields
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
              batchNumberFilter={
                batchNumberFilter
              }
              setBatchNumberFilter={
                setBatchNumberFilter
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
              FILTER ACTIONS
          ======================================== */}

          <Box
            sx={
              filterActionsContainerStyles
            }
          >
            <Button
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

export default TaskFilter;