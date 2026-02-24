import React from "react";
import Grid from "@mui/material/Grid";
import {
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  School,
  Tag,
  CalendarMonth,
} from "@mui/icons-material";

const TaskFilterFields = ({
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

  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.5,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  const selectSx = {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
      borderWidth: "2px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  return (
    <Box>
      <Grid container spacing={1.5}>

        {/* Course Name */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <School sx={{ fontSize: 16 }} />
            Course Name
          </Typography>
          <Autocomplete
            freeSolo
            options={uniqueCourses.map((c) => c.label)}
            value={selectedCourse?.label || courseInput}
            onChange={(e, newValue) => {
              const match = uniqueCourses.find((c) => c.label === newValue);
              if (match) {
                setSelectedCourse(match);
                setCourseInput(match.label);
              } else {
                setSelectedCourse(null);
                setCourseInput(newValue || "");
              }
            }}
            onInputChange={(e, newInputValue) => {
              setCourseInput(newInputValue);
              if (!newInputValue) setSelectedCourse(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select or type course..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Batch Number */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <Tag sx={{ fontSize: 16 }} />
            Batch Number
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={batchNumberFilter}
            onChange={(e) => setBatchNumberFilter(e.target.value)}
            placeholder="Search batch number..."
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Date Preset */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <CalendarMonth sx={{ fontSize: 16 }} />
            Date Range
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={datePreset}
              onChange={(e) => {
                setDatePreset(e.target.value);
                // Clear custom range when switching to a preset
                if (e.target.value !== "custom") {
                  setDateRange({ from: null, to: null });
                }
              }}
              sx={selectSx}
            >
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Dates</em>
              </MenuItem>
              <MenuItem value="today">📅 Today</MenuItem>
              <MenuItem value="7d">📅 Last 7 Days</MenuItem>
              <MenuItem value="30d">📅 Last 30 Days</MenuItem>
              <MenuItem value="month">📅 This Month</MenuItem>
              <MenuItem value="year">📅 This Year</MenuItem>
              <MenuItem value="custom">✏️ Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Date Range — only shown when preset is "custom" */}
        {datePreset === "custom" && (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={labelSx}>
                <CalendarMonth sx={{ fontSize: 16 }} />
                From
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={
                  dateRange?.from
                    ? new Date(dateRange.from).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    from: e.target.value ? new Date(e.target.value) : null,
                  }))
                }
                sx={inputSx}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={labelSx}>
                <CalendarMonth sx={{ fontSize: 16 }} />
                To
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={
                  dateRange?.to
                    ? new Date(dateRange.to).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    to: e.target.value ? new Date(e.target.value) : null,
                  }))
                }
                sx={inputSx}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}

      </Grid>
    </Box>
  );
};

export default TaskFilterFields;