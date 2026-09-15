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

import BatchFilterFields from "./BatchFilterFields";

import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

// TypeScript:
// Reuse the shared domain types already created
// for Batch and Course data.
import type { Batch } from "../../../../types/batch";
import type { Course } from "../../../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface BatchFilterProps {
  /*
   * Controls whether the filter panel is currently open.
   */
  openFilters: boolean;

  /*
   * TypeScript:
   * This needs to be a React state setter rather than
   * simply `(value: boolean) => void`.
   *
   * We use a functional update below:
   *
   * setOpenFilters((previous) => !previous)
   */
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;

  // Functions received from useFilteredTable.
  onApply: () => void;
  onReset: () => void;

  // ========================================
  // FILTER VALUES + SETTERS
  // ========================================

  batchNumber: string;
  setBatchNumber: Dispatch<
    SetStateAction<string>
  >;

  courseName: string;
  setCourseName: Dispatch<
    SetStateAction<string>
  >;

  location: string;
  setLocation: Dispatch<
    SetStateAction<string>
  >;

  createdBy: string;
  setCreatedBy: Dispatch<
    SetStateAction<string>
  >;

  status: string;
  setStatus: Dispatch<
    SetStateAction<string>
  >;

  sessionType: string;
  setSessionType: Dispatch<
    SetStateAction<string>
  >;

  sessionDay: string;
  setSessionDay: Dispatch<
    SetStateAction<string>
  >;

  // ========================================
  // DROPDOWN / FILTER DATA
  // ========================================

  batchData: Batch[];
  courseData: Course[];
}


const BatchFilter = ({
  openFilters,
  setOpenFilters,
  onApply,
  onReset,

  // Filter states
  batchNumber,
  setBatchNumber,

  courseName,
  setCourseName,

  location,
  setLocation,

  createdBy,
  setCreatedBy,

  status,
  setStatus,

  sessionType,
  setSessionType,

  sessionDay,
  setSessionDay,

  // Data for dropdowns
  batchData,
  courseData,
}: BatchFilterProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      {/* Filter Toggle Button */}
      <Button
        variant="contained"
        /*
         * TypeScript:
         * Because setOpenFilters is typed as
         * Dispatch<SetStateAction<boolean>>,
         * this functional state update is fully supported.
         */
        onClick={() =>
          setOpenFilters(
            (previous) => !previous
          )
        }
        startIcon={
          openFilters ? (
            <Close />
          ) : (
            <FilterList />
          )
        }
        sx={filterToggleButtonStyles(
          openFilters
        )}
      >
        {openFilters
          ? "Hide Filters"
          : "Show Filters"}
      </Button>

      {/* Filter Panel */}
      <Collapse
        in={openFilters}
        timeout={300}
        unmountOnExit
      >
        <Paper
          elevation={2}
          sx={filterPanelStyles}
        >
          {/* Filter Fields */}
          <Box
            sx={
              filterFieldsContainerStyles
            }
          >
            <BatchFilterFields
              batchNumber={
                batchNumber
              }
              setBatchNumber={
                setBatchNumber
              }

              courseName={
                courseName
              }
              setCourseName={
                setCourseName
              }

              location={location}
              setLocation={
                setLocation
              }

              createdBy={
                createdBy
              }
              setCreatedBy={
                setCreatedBy
              }

              status={status}
              setStatus={setStatus}

              sessionType={
                sessionType
              }
              setSessionType={
                setSessionType
              }

              sessionDay={
                sessionDay
              }
              setSessionDay={
                setSessionDay
              }

              batchData={batchData}
              courseData={courseData}
            />
          </Box>

          {/* Filter Action Buttons */}
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

export default BatchFilter;