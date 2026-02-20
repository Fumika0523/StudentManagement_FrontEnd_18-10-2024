import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import FilterFields from "./FilterFileds";
import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

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
  emailSearch,
  setEmailSearch,
  genderFilter,
  setGenderFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
  sessionType,
  setSessionType,
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
          {/* Filter Fields - Compact */}
          <Box sx={filterFieldsContainerStyles}>
            <FilterFields
              uniqueCourses={uniqueCourses}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              courseInput={courseInput}
              setCourseInput={setCourseInput}
              batchStatus={batchStatus}
              setBatchStatus={setBatchStatus}
              studentName={studentName}
              setStudentName={setStudentName}
              emailSearch={emailSearch}
              setEmailSearch={setEmailSearch}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              sessionType={sessionType}
              setSessionType={setSessionType}
              datePreset={datePreset}
              setDatePreset={setDatePreset}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Box>

          {/* Action Buttons - Compact */}
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

export default StudentFilter;