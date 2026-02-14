import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import FilterFields from "./FilterFields";
import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

const CourseFilter = ({
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  courseName,
  setCourseName,
  courseData,  // Add this
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
  sessionType,
  setSessionType 
}) => {
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      {/* Filter Toggle Button */}
      <Button
        variant="contained"
        onClick={() => setOpenFilters((v) => !v)}
        startIcon={openFilters ? <Close /> : <FilterList />}
       sx={filterToggleButtonStyles(openFilters)}
      >
        {openFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filter Panel */}
      <Collapse in={openFilters} timeout={300} unmountOnExit>
        <Paper   elevation={2}   sx={filterPanelStyles} >
          {/* Filter Fields */}
          <Box sx={{ p: 2, backgroundColor: "#f9fafb" }}>
            <FilterFields
              courseName={courseName}
              setCourseName={setCourseName}
              courseData={courseData}
              datePreset={datePreset}
              setDatePreset={setDatePreset}
              dateRange={dateRange}
              setDateRange={setDateRange}
              sessionType={sessionType}
              setSessionType={setSessionType}
            />
          </Box>

          {/* Action Buttons */}
           <Box sx={filterActionsContainerStyles}>
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

export default CourseFilter;