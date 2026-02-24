import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import TaskFilterFields from "./TaskFilterFields";
import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

const TaskFilter = ({
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  // Filter states
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
        <Paper elevation={2} sx={filterPanelStyles}>
          {/* Filter Fields */}
          <Box sx={filterFieldsContainerStyles}>
            <TaskFilterFields
              uniqueCourses={uniqueCourses}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              courseInput={courseInput}
              setCourseInput={setCourseInput}
              batchNumberFilter={batchNumberFilter}
              setBatchNumberFilter={setBatchNumberFilter}
              datePreset={datePreset}
              setDatePreset={setDatePreset}
              dateRange={dateRange}
              setDateRange={setDateRange}
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

export default TaskFilter;