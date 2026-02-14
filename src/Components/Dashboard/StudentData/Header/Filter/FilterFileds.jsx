import React from "react";
import Grid from "@mui/material/Grid2";
import {
  Typography,  TextField, Autocomplete, FormControl, Select, MenuItem, Box, InputAdornment, Chip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { 
  Search,  School,  Groups, Person,  CalendarMonth, Wifi, WifiOff 
} from "@mui/icons-material";

const FilterFields = ({
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
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
  sessionType,
  setSessionType,
}) => {
  const safeDateRange = dateRange || { from: null, to: null };
  const isCustom = datePreset === "custom";

  const handleDatePresetChange = (value) => {
    setDatePreset(value);
    if (value !== "custom") {
      setDateRange({ from: null, to: null });
    }
  };

  // Compact styles
  const labelSx = { 
    fontSize: 12, 
    fontWeight: 600, 
    mb: 0.1,
    color: "#475569",
    letterSpacing: "0.025em",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f8fafc",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3b82f6",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3b82f6",
          borderWidth: "2px",
        },
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
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  const getBatchStatusColor = (status) => {
    const colors = {
      "In Progress": { bg: "#dbeafe", text: "#1e40af" },
      "Training Completed": { bg: "#d1fae5", text: "#065f46" },
      "Batch Completed": { bg: "#e0e7ff", text: "#4338ca" },
      "Not Started": { bg: "#fee2e2", text: "#991b1b" },
    };
    return colors[status] || { bg: "#f1f5f9", text: "#475569" };
  };

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* Student Name */}
        <Grid xs={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <Person sx={{ fontSize: 16 }} />
            Student Name
          </Typography>
          <TextField
            size="small"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Search by name..."
            fullWidth
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

        {/* Course Name */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <School sx={{ fontSize: 16 }} />
            Course Name
          </Typography>
          <Autocomplete
            freeSolo
            options={uniqueCourses || []}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : opt?.label || ""
            }
            value={selectedCourse}
            inputValue={courseInput}
            onInputChange={(e, v) => setCourseInput(v)}
            onChange={(e, v) => setSelectedCourse(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select course..."
                fullWidth
                sx={inputSx}
              />
            )}
            sx={{
              "& .MuiAutocomplete-popupIndicator": {
                color: "#94a3b8",
              },
            }}
          />
        </Grid>

        {/* Batch Status */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <Groups sx={{ fontSize: 16 }} />
            Batch Status
          </Typography>
          <FormControl size="small" fullWidth>
            <Select value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)} sx={selectSx}>
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Statuses</em>
              </MenuItem>
              <MenuItem value="In Progress">
                <Chip
                  label="In Progress"
                  size="small"
                  sx={{
                    backgroundColor: getBatchStatusColor("In Progress").bg,
                    color: getBatchStatusColor("In Progress").text,
                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </MenuItem>
              <MenuItem value="Training Completed">
                <Chip
                  label="Training Completed"
                  size="small"
                  sx={{
                    backgroundColor: getBatchStatusColor("Training Completed").bg,
                    color: getBatchStatusColor("Training Completed").text,
                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </MenuItem>
              <MenuItem value="Batch Completed">
                <Chip
                  label="Batch Completed"
                  size="small"
                  sx={{
                    backgroundColor: getBatchStatusColor("Batch Completed").bg,
                    color: getBatchStatusColor("Batch Completed").text,
                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </MenuItem>
              <MenuItem value="Not Started">
                <Chip
                  label="Not Started"
                  size="small"
                  sx={{
                    backgroundColor: getBatchStatusColor("Not Started").bg,
                    color: getBatchStatusColor("Not Started").text,
                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Gender */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <Person sx={{ fontSize: 16 }} />
            Gender
          </Typography>
          <FormControl size="small" fullWidth>
            <Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} sx={selectSx}>
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Genders</em>
              </MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Session Type */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <Wifi sx={{ fontSize: 16 }} />
            Session Type
          </Typography>
          <FormControl size="small" fullWidth>
            <Select value={sessionType} onChange={(e) => setSessionType(e.target.value)} sx={selectSx}>
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Types</em>
              </MenuItem>
              <MenuItem value="Online">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Wifi sx={{ fontSize: 16, color: "#059669" }} />
                  Online
                </Box>
              </MenuItem>
              <MenuItem value="Offline">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WifiOff sx={{ fontSize: 16, color: "#dc2626" }} />
                  Offline
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Created Date - Preset Dropdown */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Typography sx={labelSx}>
            <CalendarMonth sx={{ fontSize: 16 }} />
            Created Date
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={datePreset || ""}
              onChange={(e) => handleDatePresetChange(e.target.value)}
              sx={selectSx}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Dates</em>
              </MenuItem>
              <MenuItem value="today">📅 Today</MenuItem>
              <MenuItem value="7d">📊 Last 7 days</MenuItem>
              <MenuItem value="30d">📈 Last 30 days</MenuItem>
              <MenuItem value="month">🗓️ This month</MenuItem>
              <MenuItem value="year">📆 This year</MenuItem>
              <MenuItem value="custom">🎯 Custom range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Date Range - From Date */}
        {isCustom && (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography sx={labelSx}>
              <CalendarMonth sx={{ fontSize: 16 }} />
              From Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={safeDateRange.from ? dayjs(safeDateRange.from) : null}
                onChange={(v) =>
                  setDateRange((prev) => ({
                    ...(prev || { from: null, to: null }),
                    from: v ? v.toDate() : null,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
                    placeholder: "Start date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}

        {/* Custom Date Range - To Date */}
        {isCustom && (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography sx={labelSx}>
              <CalendarMonth sx={{ fontSize: 16 }} />
              To Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={safeDateRange.to ? dayjs(safeDateRange.to) : null}
                onChange={(v) =>
                  setDateRange((prev) => ({
                    ...(prev || { from: null, to: null }),
                    to: v ? v.toDate() : null,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
                    placeholder: "End date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FilterFields;