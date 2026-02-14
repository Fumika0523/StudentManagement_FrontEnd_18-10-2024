import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import BatchFilterFields from "./BatchFilterFields";

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
        sx={{
          width: "100%",
          borderRadius: openFilters ? "10px 10px 0 0" : "10px",
          backgroundColor: openFilters ? "#1e40af" : "#3b82f6",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          px: 2.5,
          py: 1,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#1e40af",
          },
        }}
      >
        {openFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filter Panel */}
      <Collapse in={openFilters} timeout={300} unmountOnExit>
        <Paper
          elevation={2}
          sx={{
            borderRadius: "0 0 10px 10px",
            border: "1px solid #e5e7eb",
            borderTop: "none",
            overflow: "hidden",
          }}
        >
          {/* Filter Fields */}
          <Box sx={{ p: 2, backgroundColor: "#f9fafb" }}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              px: 2,
              py: 1.5,
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button
              variant="outlined"
              onClick={onReset}
              size="small"
              sx={{
                borderColor: "#d1d5db",
                color: "#6b7280",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "13px",
                px: 2.5,
                borderRadius: "7px",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              onClick={onApply}
              size="small"
              sx={{
                backgroundColor: "#3b82f6",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "13px",
                px: 3,
                borderRadius: "7px",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
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