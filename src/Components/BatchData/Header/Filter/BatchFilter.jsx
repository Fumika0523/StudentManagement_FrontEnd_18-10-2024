import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import BatchFilterFields from "./BatchFilterFields";
import {
  filterToggleButtonStyles,
  filterPanelStyles,
  filterFieldsContainerStyles,
  filterActionsContainerStyles,
  resetButtonStyles,
  applyButtonStyles,
} from "../../../utils/constant";

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
            <BatchFilterFields
              batchNumber={batchNumber}
              setBatchNumber={setBatchNumber}
              courseName={courseName}
              setCourseName={setCourseName}
              location={location}
              setLocation={setLocation}
              createdBy={createdBy}
              setCreatedBy={setCreatedBy}
              status={status}
              setStatus={setStatus}
              sessionType={sessionType}
              setSessionType={setSessionType}
              sessionDay={sessionDay}
              setSessionDay={setSessionDay}
              batchData={batchData}
              courseData={courseData}
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

export default BatchFilter;